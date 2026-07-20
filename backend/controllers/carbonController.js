import CarbonCredit from "../models/CarbonCredit.js";
import User from "../models/User.js";
import mongoose from "mongoose";

// @route GET /api/carbon/mine
export const getMyCarbonCredits = async (req, res, next) => {
  try {
    const credits = await CarbonCredit.find({ user: req.user._id })
      .populate("transaction", "kwh totalAmount createdAt")
      .sort({ issuedAt: -1 });
    res.json(credits);
  } catch (err) {
    next(err);
  }
};

// @route GET /api/carbon/summary
export const getCarbonSummary = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const [agg] = await CarbonCredit.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalKwhSold: { $sum: "$kwhSold" },
          totalCo2SavedKg: { $sum: "$co2SavedKg" },
          totalCredits: { $sum: "$creditsEarned" },
          certificates: { $sum: 1 },
        },
      },
    ]);

    const user = await User.findById(req.user._id).select("carbonCreditsTotal");
    res.json({
      totalKwhSold: agg?.totalKwhSold || 0,
      totalCo2SavedKg: Number((agg?.totalCo2SavedKg || 0).toFixed(2)),
      totalCredits: Number((agg?.totalCredits || 0).toFixed(3)),
      certificateCount: agg?.certificates || 0,
      carbonCreditsTotal: user?.carbonCreditsTotal || 0,
    });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/carbon/:id/certificate
export const getCarbonCertificate = async (req, res, next) => {
  try {
    const credit = await CarbonCredit.findById(req.params.id)
      .populate("user", "name email")
      .populate("transaction", "kwh pricePerKwh settledAt");
    if (!credit) return res.status(404).json({ message: "Carbon credit not found" });
    if (String(credit.user._id) !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not allowed to view this certificate" });
    }

    const certificate = {
      certificateId: credit._id,
      holder: credit.user.name,
      email: credit.user.email,
      kwhSold: credit.kwhSold,
      co2SavedKg: credit.co2SavedKg,
      creditsEarned: credit.creditsEarned,
      issuedAt: credit.issuedAt,
      certificateUrl:
        credit.certificateUrl ||
        `https://solarshare.local/certificates/${credit._id}.pdf`,
      transaction: credit.transaction,
    };
    res.json(certificate);
  } catch (err) {
    next(err);
  }
};
