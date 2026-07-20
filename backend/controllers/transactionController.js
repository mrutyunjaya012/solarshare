import Listing from "../models/Listing.js";
import Transaction from "../models/Transaction.js";
import CarbonCredit from "../models/CarbonCredit.js";
import Wallet from "../models/Wallet.js";
import Dispute from "../models/Dispute.js";
import User from "../models/User.js";
import { applyWalletEntry } from "./walletController.js";
import { createNotification } from "../utils/notify.js";

const PLATFORM_FEE_RATE = 0.02; // 2%
const TAX_RATE = 0.05; // 5%
const CO2_PER_KWH = 0.82; // kg CO2 offset per kWh of solar energy (grid emission factor)
const CREDITS_PER_KG_CO2 = 0.01; // arbitrary but documentable conversion for the demo

// Consumer buys `kwh` from a listing. This is the "Matching Engine ->
// Purchase" endpoint: the matching engine (services/matchingEngine.js)
// decides WHICH listing to recommend; this endpoint executes the purchase
// against whichever listing the buyer confirms.
export const purchaseEnergy = async (req, res, next) => {
  try {
    const { listingId } = req.body;
    const kwh = Number(req.body.kwh);
    if (!Number.isFinite(kwh) || kwh <= 0) {
      return res.status(400).json({ message: "Purchase quantity must be a positive number" });
    }
    const listing = await Listing.findById(listingId);
    if (!listing || listing.status !== "active") {
      return res.status(400).json({ message: "Listing not available" });
    }
    if (kwh > listing.availableKwh) {
      return res.status(400).json({ message: "Requested kWh exceeds availability" });
    }
    if (String(listing.seller) === String(req.user._id)) {
      return res.status(400).json({ message: "You cannot buy your own listing" });
    }

    const subtotal = kwh * listing.pricePerKwh;
    const platformFee = +(subtotal * PLATFORM_FEE_RATE).toFixed(2);
    const tax = +(subtotal * TAX_RATE).toFixed(2);
    const totalAmount = +(subtotal + platformFee + tax).toFixed(2);
    let buyerWallet = await Wallet.findOne({ user: req.user._id });
    if (!buyerWallet) buyerWallet = await Wallet.create({ user: req.user._id, balance: 0 });
    if (buyerWallet.balance < totalAmount) {
      return res.status(400).json({ message: "Insufficient wallet balance. Add demo funds and try again." });
    }
    // Supports accounts created before wallets were introduced.
    const sellerWallet = await Wallet.findOne({ user: listing.seller });
    if (!sellerWallet) await Wallet.create({ user: listing.seller, balance: 0 });

    const transaction = await Transaction.create({
      buyer: req.user._id,
      seller: listing.seller,
      listing: listing._id,
      kwh,
      pricePerKwh: listing.pricePerKwh,
      platformFee,
      tax,
      totalAmount,
      status: "completed",
      settledAt: new Date(),
    });

    listing.availableKwh -= kwh;
    if (listing.availableKwh <= 0) listing.status = "sold_out";
    await listing.save();

    // Settlement: debit buyer, credit seller.
    await applyWalletEntry(req.user._id, "debit", totalAmount, "energy_purchase", transaction._id);
    await applyWalletEntry(listing.seller, "credit", subtotal, "energy_sale", transaction._id);

    // Carbon credits accrue to the seller for the solar energy they supplied.
    const co2SavedKg = +(kwh * CO2_PER_KWH).toFixed(2);
    const creditsEarned = +(co2SavedKg * CREDITS_PER_KG_CO2).toFixed(3);
    await CarbonCredit.create({
      user: listing.seller,
      kwhSold: kwh,
      co2SavedKg,
      creditsEarned,
      transaction: transaction._id,
    });
    await User.findByIdAndUpdate(listing.seller, { $inc: { carbonCreditsTotal: creditsEarned } });

    await createNotification({
      user: listing.seller,
      type: "listing_sold",
      title: "Energy sold",
      message: `${kwh} kWh sold from your listing for ₹${subtotal.toFixed(2)}.`,
      relatedId: transaction._id,
    });
    await createNotification({
      user: req.user._id,
      type: "purchase",
      title: "Purchase complete",
      message: `You purchased ${kwh} kWh for ₹${totalAmount.toFixed(2)}.`,
      relatedId: transaction._id,
    });

    const io = req.app.get("io");
    io?.to(String(listing.seller)).emit("notification", {
      type: "listing_sold",
      message: `${kwh} kWh sold from your listing`,
    });

    res.status(201).json(transaction);
  } catch (err) {
    next(err);
  }
};

export const getMyTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({
      $or: [{ buyer: req.user._id }, { seller: req.user._id }],
    })
      .populate("buyer", "name")
      .populate("seller", "name")
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    next(err);
  }
};

// @route GET /api/transactions/stats
export const getTransactionStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const [bought, sold] = await Promise.all([
      Transaction.aggregate([
        { $match: { buyer: userId, status: "completed" } },
        { $group: { _id: null, kwh: { $sum: "$kwh" }, amount: { $sum: "$totalAmount" }, count: { $sum: 1 } } },
      ]),
      Transaction.aggregate([
        { $match: { seller: userId, status: "completed" } },
        { $group: { _id: null, kwh: { $sum: "$kwh" }, amount: { $sum: "$totalAmount" }, count: { $sum: 1 } } },
      ]),
    ]);
    res.json({
      purchased: { kwh: bought[0]?.kwh || 0, amount: bought[0]?.amount || 0, count: bought[0]?.count || 0 },
      sold: { kwh: sold[0]?.kwh || 0, amount: sold[0]?.amount || 0, count: sold[0]?.count || 0 },
    });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/transactions/:id
export const getTransactionById = async (req, res, next) => {
  try {
    const tx = await Transaction.findById(req.params.id)
      .populate("buyer", "name email")
      .populate("seller", "name email")
      .populate("listing");
    if (!tx) return res.status(404).json({ message: "Transaction not found" });

    const uid = String(req.user._id);
    const allowed =
      req.user.role === "admin" ||
      String(tx.buyer._id) === uid ||
      String(tx.seller._id) === uid;
    if (!allowed) return res.status(403).json({ message: "Not allowed to view this transaction" });

    res.json(tx);
  } catch (err) {
    next(err);
  }
};

// @route POST /api/transactions/:id/dispute
export const openDispute = async (req, res, next) => {
  try {
    const { reason, evidenceUrls } = req.body;
    if (!reason?.trim()) return res.status(400).json({ message: "Dispute reason is required" });

    const tx = await Transaction.findById(req.params.id);
    if (!tx) return res.status(404).json({ message: "Transaction not found" });

    const uid = String(req.user._id);
    if (String(tx.buyer) !== uid && String(tx.seller) !== uid) {
      return res.status(403).json({ message: "Only buyer or seller can open a dispute" });
    }
    if (!["completed", "pending"].includes(tx.status)) {
      return res.status(400).json({ message: `Cannot dispute a ${tx.status} transaction` });
    }

    const existing = await Dispute.findOne({ transaction: tx._id, status: { $in: ["open", "under_review"] } });
    if (existing) return res.status(409).json({ message: "An open dispute already exists for this transaction" });

    const against = String(tx.buyer) === uid ? tx.seller : tx.buyer;
    const dispute = await Dispute.create({
      transaction: tx._id,
      raisedBy: req.user._id,
      against,
      reason: reason.trim(),
      evidenceUrls: Array.isArray(evidenceUrls) ? evidenceUrls : [],
    });

    tx.status = "disputed";
    await tx.save();

    await createNotification({
      user: against,
      type: "dispute",
      title: "Dispute opened",
      message: `A dispute was opened on transaction ${tx._id}.`,
      relatedId: dispute._id,
    });

    res.status(201).json(dispute);
  } catch (err) {
    next(err);
  }
};
