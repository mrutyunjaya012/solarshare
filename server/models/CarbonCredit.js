import mongoose from "mongoose";

const carbonCreditSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    transaction: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
    kwhSold: { type: Number, required: true },
    co2SavedKg: { type: Number, required: true }, // derived: kwhSold * emissionFactor
    creditsEarned: { type: Number, required: true }, // derived: co2SavedKg / creditsPerKg
    certificateUrl: { type: String },
    issuedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("CarbonCredit", carbonCreditSchema);
