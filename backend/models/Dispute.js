import mongoose from "mongoose";

const disputeSchema = new mongoose.Schema(
  {
    transaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
      required: true,
      index: true,
    },
    raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    against: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reason: { type: String, required: true, trim: true },
    evidenceUrls: [{ type: String }],
    status: {
      type: String,
      enum: ["open", "under_review", "resolved", "rejected"],
      default: "open",
    },
    resolution: { type: String },
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Dispute", disputeSchema);
