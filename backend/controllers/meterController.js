import MeterReading from "../models/MeterReading.js";

// @route GET /api/meter/latest   (current user's most recent reading)
export const getLatestReading = async (req, res) => {
  try {
    const reading = await MeterReading.findOne({ user: req.user._id }).sort({ recordedAt: -1 });
    res.status(200).json(reading || {});
  } catch (err) {
    res.status(500).json({ message: "Could not fetch meter reading", error: err.message });
  }
};

// @route GET /api/meter/history?range=today|week|month
export const getReadingHistory = async (req, res) => {
  try {
    const { range = "today" } = req.query;
    const since = new Date();
    if (range === "today") since.setHours(0, 0, 0, 0);
    if (range === "week") since.setDate(since.getDate() - 7);
    if (range === "month") since.setMonth(since.getMonth() - 1);

    const readings = await MeterReading.find({
      user: req.user._id,
      recordedAt: { $gte: since },
    }).sort({ recordedAt: 1 });

    res.status(200).json(readings);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch reading history", error: err.message });
  }
};
