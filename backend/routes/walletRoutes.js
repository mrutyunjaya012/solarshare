import express from "express";
import { protect } from "../middleware/auth.js";
import { getMyWallet, topUpDemoWallet } from "../controllers/walletController.js";

const router = express.Router();

router.get("/", protect, getMyWallet);
router.post("/top-up", protect, topUpDemoWallet);

export default router;
