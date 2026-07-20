import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    listing: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true },
    kwh: { type: Number, required: true },
    pricePerKwh: { type: Number, required: true },
    platformFee: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "disputed"],
      default: "pending",
    },
    settledAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
