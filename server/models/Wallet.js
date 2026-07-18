import mongoose from "mongoose";

const walletEntrySchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["credit", "debit"], required: true },
    amount: { type: Number, required: true },
    reason: { type: String, required: true }, // e.g. "energy_sale", "energy_purchase", "withdrawal"
    relatedTransaction: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const walletSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    balance: { type: Number, default: 0 },
    history: [walletEntrySchema],
  },
  { timestamps: true }
);

export default mongoose.model("Wallet", walletSchema);
