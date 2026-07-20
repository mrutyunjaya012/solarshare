import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getMyCarbonCredits,
  getCarbonSummary,
  getCarbonCertificate,
} from "../controllers/carbonController.js";

const router = express.Router();

router.get("/mine", protect, getMyCarbonCredits);
router.get("/summary", protect, getCarbonSummary);
router.get("/:id/certificate", protect, getCarbonCertificate);

export default router;
