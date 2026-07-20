import User from "../models/User.js";
import MeterReading from "../models/MeterReading.js";

// Stands in for real smart-meter/IoT hardware. Every INTERVAL_MS, generates a
// plausible reading for every prosumer/consumer and writes it to Mongo.
// This is what "powers" the dashboards, grid load view, and pricing engine.

const INTERVAL_MS = 60 * 1000; // one simulated tick per minute; tune as needed

const hourOfDayFactor = () => {
  // crude solar bell curve: 0 at night, peak at midday
  const hour = new Date().getHours();
  const distanceFromNoon = Math.abs(12 - hour);
  return Math.max(0, 1 - distanceFromNoon / 8);
};

const randomBetween = (min, max) => Math.random() * (max - min) + min;

export const runSimulationTick = async () => {
  const users = await User.find({ role: { $in: ["prosumer", "consumer"] } }).select(
    "_id role solarPanel.capacityKw"
  );

  const docs = users.map((user) => {
    const consumptionKwh = Number(randomBetween(0.1, 1.2).toFixed(3));

    if (user.role === "prosumer") {
      const capacity = user.solarPanel?.capacityKw || 3;
      const generationKwh = Number((capacity * hourOfDayFactor() * randomBetween(0.6, 1)).toFixed(3));
      const surplusKwh = Number(Math.max(0, generationKwh - consumptionKwh).toFixed(3));
      return {
        user: user._id,
        role: "prosumer",
        generationKwh,
        consumptionKwh,
        surplusKwh,
      };
    }

    return {
      user: user._id,
      role: "consumer",
      generationKwh: 0,
      consumptionKwh,
      surplusKwh: 0,
    };
  });

  if (docs.length) {
    await MeterReading.insertMany(docs);
  }
};

export const startMeterSimulator = () => {
  runSimulationTick().catch((err) => console.error("Meter simulation tick failed:", err.message));
  setInterval(() => {
    runSimulationTick().catch((err) => console.error("Meter simulation tick failed:", err.message));
  }, INTERVAL_MS);
  console.log(`Smart meter simulator started (tick every ${INTERVAL_MS / 1000}s)`);
};
