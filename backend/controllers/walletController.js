import Wallet from "../models/Wallet.js";
import { createNotification } from "../utils/notify.js";

export const getMyWallet = async (req, res, next) => {
  try {
    let wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) wallet = await Wallet.create({ user: req.user._id, balance: 0 });
    res.json(wallet);
  } catch (err) {
    next(err);
  }
};

// @route GET /api/wallet/balance
export const getWalletBalance = async (req, res, next) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user._id }).select("balance");
    res.json({ balance: wallet?.balance || 0 });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/wallet/history?type=&limit=
export const getWalletHistory = async (req, res, next) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) return res.json({ history: [], balance: 0 });

    let history = [...wallet.history].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    if (req.query.type) history = history.filter((h) => h.type === req.query.type);
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    res.json({ balance: wallet.balance, history: history.slice(0, limit) });
  } catch (err) {
    next(err);
  }
};

// Deliberately a demo-only credit operation; replace with a payment gateway webhook in production.
export const topUpDemoWallet = async (req, res, next) => {
  try {
    const amount = Number(req.body.amount);
    if (!Number.isFinite(amount) || amount <= 0 || amount > 10000) {
      return res.status(400).json({ message: "Enter an amount between ₹1 and ₹10,000" });
    }
    let wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) wallet = await Wallet.create({ user: req.user._id, balance: 0, history: [] });
    wallet.balance += amount;
    wallet.history.push({ type: "credit", amount, reason: "demo_top_up" });
    await wallet.save();
    await createNotification({
      user: req.user._id,
      type: "wallet",
      title: "Wallet topped up",
      message: `₹${amount} added to your wallet.`,
    });
    res.json(wallet);
  } catch (err) {
    next(err);
  }
};

// @route POST /api/wallet/withdraw
export const withdrawDemoWallet = async (req, res, next) => {
  try {
    const amount = Number(req.body.amount);
    if (!Number.isFinite(amount) || amount <= 0 || amount > 10000) {
      return res.status(400).json({ message: "Enter an amount between ₹1 and ₹10,000" });
    }
    const wallet = await applyWalletEntry(req.user._id, "debit", amount, "withdrawal");
    await createNotification({
      user: req.user._id,
      type: "wallet",
      title: "Withdrawal processed",
      message: `₹${amount} withdrawn from your wallet (demo).`,
    });
    res.json(wallet);
  } catch (err) {
    next(err);
  }
};

// Internal helper used by the purchase flow (transactionController) to
// credit a seller and debit a buyer atomically-ish. In production, wrap
// both calls in a Mongo session/transaction.
export const applyWalletEntry = async (userId, type, amount, reason, relatedTransaction) => {
  const wallet = await Wallet.findOne({ user: userId });
  if (!wallet) throw new Error("Wallet not found for user");

  const change = type === "credit" ? amount : -amount;
  if (wallet.balance + change < 0) throw Object.assign(new Error("Insufficient wallet balance"), { status: 400 });
  wallet.balance += change;
  wallet.history.push({ type, amount, reason, relatedTransaction });
  await wallet.save();
  return wallet;
};
