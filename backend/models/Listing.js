import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    availableKwh: { type: Number, required: true, min: 0 },
    pricePerKwh: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["active", "sold_out", "expired", "cancelled"],
      default: "active",
    },
    availableFrom: { type: Date, default: Date.now },
    availableUntil: { type: Date },
    location: {
      lat: Number,
      lng: Number,
      city: String,
    },
  },
  { timestamps: true }
);

listingSchema.index({ status: 1, pricePerKwh: 1 });

export default mongoose.model("Listing", listingSchema);
