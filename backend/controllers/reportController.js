import Transaction from "../models/Transaction.js";
import CarbonCredit from "../models/CarbonCredit.js";
import Listing from "../models/Listing.js";
import Wallet from "../models/Wallet.js";

// @route GET /api/reports/impact
export const getImpactReport = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [bought, sold, carbon, listings, wallet] = await Promise.all([
      Transaction.aggregate([
        { $match: { buyer: userId, status: "completed" } },
        {
          $group: {
            _id: null,
            kwh: { $sum: "$kwh" },
            spent: { $sum: "$totalAmount" },
            count: { $sum: 1 },
          },
        },
      ]),
      Transaction.aggregate([
        { $match: { seller: userId, status: "completed" } },
        {
          $group: {
            _id: null,
            kwh: { $sum: "$kwh" },
            earned: { $sum: { $subtract: ["$totalAmount", { $add: ["$platformFee", "$tax"] }] } },
            count: { $sum: 1 },
          },
        },
      ]),
      CarbonCredit.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: null,
            co2SavedKg: { $sum: "$co2SavedKg" },
            credits: { $sum: "$creditsEarned" },
          },
        },
      ]),
      Listing.aggregate([
        { $match: { seller: userId } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      Wallet.findOne({ user: userId }).select("balance"),
    ]);

    res.json({
      generatedAt: new Date(),
      user: { id: userId, name: req.user.name, role: req.user.role },
      energy: {
        purchasedKwh: bought[0]?.kwh || 0,
        soldKwh: sold[0]?.kwh || 0,
        purchaseCount: bought[0]?.count || 0,
        saleCount: sold[0]?.count || 0,
      },
      finance: {
        spent: Number((bought[0]?.spent || 0).toFixed(2)),
        earned: Number((sold[0]?.earned || 0).toFixed(2)),
        walletBalance: wallet?.balance || 0,
      },
      environment: {
        co2SavedKg: Number((carbon[0]?.co2SavedKg || 0).toFixed(2)),
        carbonCredits: Number((carbon[0]?.credits || 0).toFixed(3)),
      },
      listings: Object.fromEntries(listings.map((l) => [l._id, l.count])),
    });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/reports/monthly?months=6
export const getMonthlyReport = async (req, res, next) => {
  try {
    const months = Math.min(Math.max(Number(req.query.months) || 6, 1), 24);
    const since = new Date();
    since.setMonth(since.getMonth() - months);

    const series = await Transaction.aggregate([
      {
        $match: {
          status: "completed",
          createdAt: { $gte: since },
          $or: [{ buyer: req.user._id }, { seller: req.user._id }],
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            side: {
              $cond: [{ $eq: ["$buyer", req.user._id] }, "buy", "sell"],
            },
          },
          kwh: { $sum: "$kwh" },
          amount: { $sum: "$totalAmount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.json({ months, series });
  } catch (err) {
    next(err);
  }
};
