import Dispute from "../models/Dispute.js";

// @route GET /api/disputes/mine
export const getMyDisputes = async (req, res, next) => {
  try {
    const disputes = await Dispute.find({
      $or: [{ raisedBy: req.user._id }, { against: req.user._id }],
    })
      .populate("transaction", "kwh totalAmount status createdAt")
      .populate("raisedBy", "name email")
      .populate("against", "name email")
      .sort({ createdAt: -1 });
    res.json(disputes);
  } catch (err) {
    next(err);
  }
};

// @route GET /api/disputes/:id
export const getDisputeById = async (req, res, next) => {
  try {
    const dispute = await Dispute.findById(req.params.id)
      .populate("transaction")
      .populate("raisedBy", "name email")
      .populate("against", "name email")
      .populate("resolvedBy", "name");
    if (!dispute) return res.status(404).json({ message: "Dispute not found" });

    const uid = String(req.user._id);
    const allowed =
      req.user.role === "admin" ||
      String(dispute.raisedBy._id) === uid ||
      String(dispute.against._id) === uid;
    if (!allowed) return res.status(403).json({ message: "Not allowed to view this dispute" });

    res.json(dispute);
  } catch (err) {
    next(err);
  }
};
