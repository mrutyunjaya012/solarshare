import mongoose from "mongoose";

// One document per prosumer/consumer per simulated tick.
// A background job (services/meterSimulator.js) writes these on an interval,
// standing in for real smart-meter/IoT hardware.
const meterReadingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    role: { type: String, enum: ["prosumer", "consumer"], required: true },
    generationKwh: { type: Number, default: 0 }, // prosumers only
    consumptionKwh: { type: Number, default: 0 },
    surplusKwh: { type: Number, default: 0 }, // generation - consumption, prosumers only
    recordedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

meterReadingSchema.index({ user: 1, recordedAt: -1 });

export default mongoose.model("MeterReading", meterReadingSchema);
