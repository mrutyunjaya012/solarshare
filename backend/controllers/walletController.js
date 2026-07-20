import Wallet from "../models/Wallet.js";

export const getMyWallet = async (req, res, next) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user._id });
    res.json(wallet);
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
    const wallet = await Wallet.findOneAndUpdate(
      { user: req.user._id },
      { $inc: { balance: amount }, $push: { history: { type: "credit", amount, reason: "demo_top_up" } } },
      { new: true }
    );
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
