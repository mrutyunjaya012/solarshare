import User from "../models/User.js";
import Listing from "../models/Listing.js";
import Transaction from "../models/Transaction.js";
import MeterReading from "../models/MeterReading.js";
import Dispute from "../models/Dispute.js";
import CarbonCredit from "../models/CarbonCredit.js";

/* ── GET /admin/overview ─────────────────────────────── */
export const getOverview = async (req, res, next) => {
  try {
    const [totalUsers, activeListings, energy, revenue] = await Promise.all([
      User.countDocuments(),
      Listing.countDocuments({ status: "active" }),
      Transaction.aggregate([{ $match: { status: "completed" } }, { $group: { _id: null, total: { $sum: "$kwh" } } }]),
      Transaction.aggregate([{ $match: { status: "completed" } }, { $group: { _id: null, total: { $sum: "$totalAmount" } } }]),
    ]);
    res.json({ totalUsers, activeListings, energySoldKwh: energy[0]?.total || 0, platformVolume: revenue[0]?.total || 0 });
  } catch (err) { next(err); }
};

/* ── GET /admin/users ────────────────────────────────── */
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    res.json({ users });
  } catch (err) { next(err); }
};

/* ── PATCH /admin/users/:id/block ────────────────────── */
export const toggleBlockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "admin") return res.status(403).json({ message: "Cannot block an admin" });
    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json({ message: `User ${user.isBlocked ? "blocked" : "unblocked"} successfully`, isBlocked: user.isBlocked });
  } catch (err) { next(err); }
};

/* ── DELETE /admin/users/:id ─────────────────────────── */
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "admin") return res.status(403).json({ message: "Cannot delete an admin" });
    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (err) { next(err); }
};

/* ── GET /admin/listings ─────────────────────────────── */
export const getAllListings = async (req, res, next) => {
  try {
    const listings = await Listing.find({})
      .populate("seller", "name email address")
      .sort({ createdAt: -1 });
    res.json({ listings });
  } catch (err) { next(err); }
};

/* ── DELETE /admin/listings/:id ──────────────────────── */
export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findByIdAndDelete(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    res.json({ message: "Listing deleted" });
  } catch (err) { next(err); }
};

/* ── GET /admin/transactions ─────────────────────────── */
export const getAllTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({})
      .populate("buyer", "name email")
      .populate("seller", "name email")
      .sort({ createdAt: -1 })
      .limit(200);
    res.json({ transactions });
  } catch (err) { next(err); }
};

/* ── PATCH /admin/transactions/:id/dispute ───────────── */
export const resolveDispute = async (req, res, next) => {
  try {
    const tx = await Transaction.findById(req.params.id);
    if (!tx) return res.status(404).json({ message: "Transaction not found" });
    tx.status = req.body.resolution || "completed";
    tx.settledAt = new Date();
    await tx.save();
    res.json({ message: "Dispute resolved", transaction: tx });
  } catch (err) { next(err); }
};

/* ── GET /admin/meters ───────────────────────────────── */
export const getAllMeterReadings = async (req, res, next) => {
  try {
    const readings = await MeterReading.find({})
      .populate("user", "name email role")
      .sort({ recordedAt: -1 })
      .limit(100);
    res.json({ readings });
  } catch (err) { next(err); }
};

/* ── PATCH /admin/users/:id/verify ───────────────────── */
export const verifyUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.isVerified = true;
    await user.save();
    res.json({ message: "User verified", user: { id: user._id, isVerified: true } });
  } catch (err) { next(err); }
};

/* ── GET /admin/disputes ─────────────────────────────── */
export const getAllDisputes = async (req, res, next) => {
  try {
    const disputes = await Dispute.find({})
      .populate("transaction", "kwh totalAmount status")
      .populate("raisedBy", "name email")
      .populate("against", "name email")
      .sort({ createdAt: -1 });
    res.json({ disputes });
  } catch (err) { next(err); }
};

/* ── PATCH /admin/disputes/:id ───────────────────────── */
export const resolveDisputeCase = async (req, res, next) => {
  try {
    const { status = "resolved", resolution } = req.body;
    if (!["resolved", "rejected", "under_review"].includes(status)) {
      return res.status(400).json({ message: "Invalid dispute status" });
    }
    const dispute = await Dispute.findById(req.params.id);
    if (!dispute) return res.status(404).json({ message: "Dispute not found" });

    dispute.status = status;
    dispute.resolution = resolution || dispute.resolution;
    dispute.resolvedBy = req.user._id;
    dispute.resolvedAt = new Date();
    await dispute.save();

    if (status === "resolved" || status === "rejected") {
      const tx = await Transaction.findById(dispute.transaction);
      if (tx && tx.status === "disputed") {
        tx.status = status === "resolved" ? "completed" : "failed";
        tx.settledAt = new Date();
        await tx.save();
      }
    }

    res.json({ message: "Dispute updated", dispute });
  } catch (err) { next(err); }
};

/* ── GET /admin/carbon ───────────────────────────────── */
export const getAllCarbonCredits = async (req, res, next) => {
  try {
    const credits = await CarbonCredit.find({})
      .populate("user", "name email")
      .sort({ issuedAt: -1 })
      .limit(200);
    res.json({ credits });
  } catch (err) { next(err); }
};
