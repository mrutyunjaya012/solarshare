import express from "express";
import {
  getLatestReading,
  getReadingHistory,
  getLatestSurplus,
  getGridLoad,
} from "../controllers/meterController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/latest", protect, getLatestReading);
router.get("/history", protect, getReadingHistory);
router.get("/surplus", protect, getLatestSurplus);
router.get("/grid-load", protect, getGridLoad);

export default router;
