import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import { getOverview } from "../controllers/adminController.js";

const router = express.Router();
router.get("/overview", protect, authorize("admin"), getOverview);
export default router;
