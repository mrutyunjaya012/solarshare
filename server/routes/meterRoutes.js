import express from "express";
import { getLatestReading, getReadingHistory } from "../controllers/meterController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/latest", protect, getLatestReading);
router.get("/history", protect, getReadingHistory);

export default router;
