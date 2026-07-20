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

// @route GET /api/meter/surplus
export const getLatestSurplus = async (req, res, next) => {
  try {
    const reading = await MeterReading.findOne({ user: req.user._id }).sort({ recordedAt: -1 });
    res.json({
      surplusKwh: reading?.surplusKwh || 0,
      generationKwh: reading?.generationKwh || 0,
      consumptionKwh: reading?.consumptionKwh || 0,
      recordedAt: reading?.recordedAt || null,
    });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/meter/grid-load
export const getGridLoad = async (req, res, next) => {
  try {
    const since = new Date(Date.now() - 60 * 60 * 1000); // last hour of simulator ticks
    const [agg] = await MeterReading.aggregate([
      { $match: { recordedAt: { $gte: since } } },
      {
        $group: {
          _id: null,
          generationKwh: { $sum: "$generationKwh" },
          consumptionKwh: { $sum: "$consumptionKwh" },
          surplusKwh: { $sum: "$surplusKwh" },
          readings: { $sum: 1 },
        },
      },
    ]);
    res.json({
      window: "1h",
      generationKwh: Number((agg?.generationKwh || 0).toFixed(2)),
      consumptionKwh: Number((agg?.consumptionKwh || 0).toFixed(2)),
      surplusKwh: Number((agg?.surplusKwh || 0).toFixed(2)),
      readings: agg?.readings || 0,
      loadRatio:
        agg?.generationKwh > 0
          ? Number((agg.consumptionKwh / agg.generationKwh).toFixed(3))
          : null,
    });
  } catch (err) {
    next(err);
  }
};
