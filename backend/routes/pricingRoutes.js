import express from "express";
import { protect } from "../middleware/auth.js";
import { getSuggestedPrice, getMarketPricing } from "../controllers/pricingController.js";

const router = express.Router();

router.get("/suggest", protect, getSuggestedPrice);
router.get("/market", protect, getMarketPricing);

export default router;
