import User from "../models/User.js";
import Listing from "../models/Listing.js";
import Transaction from "../models/Transaction.js";

export const getOverview = async (req, res, next) => {
  try {
    const [totalUsers, activeListings, energy, revenue] = await Promise.all([
      User.countDocuments(),
      Listing.countDocuments({ status: "active" }),
      Transaction.aggregate([{ $match: { status: "completed" } }, { $group: { _id: null, total: { $sum: "$kwh" } } }]),
      Transaction.aggregate([{ $match: { status: "completed" } }, { $group: { _id: null, total: { $sum: "$totalAmount" } } }]),
    ]);
    res.json({ totalUsers, activeListings, energySoldKwh: energy[0]?.total || 0, platformVolume: revenue[0]?.total || 0 });
  } catch (err) {
    next(err);
  }
};
