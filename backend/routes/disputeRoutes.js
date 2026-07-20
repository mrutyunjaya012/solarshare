import express from "express";
import { protect } from "../middleware/auth.js";
import { getMyDisputes, getDisputeById } from "../controllers/disputeController.js";

const router = express.Router();

router.get("/mine", protect, getMyDisputes);
router.get("/:id", protect, getDisputeById);

export default router;
