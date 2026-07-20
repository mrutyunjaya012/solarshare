import express from "express";
import { protect } from "../middleware/auth.js";
import { getImpactReport, getMonthlyReport } from "../controllers/reportController.js";

const router = express.Router();

router.get("/impact", protect, getImpactReport);
router.get("/monthly", protect, getMonthlyReport);

export default router;
