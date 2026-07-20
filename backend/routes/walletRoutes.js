import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getMyWallet,
  getWalletBalance,
  getWalletHistory,
  topUpDemoWallet,
  withdrawDemoWallet,
} from "../controllers/walletController.js";

const router = express.Router();

router.get("/", protect, getMyWallet);
router.get("/balance", protect, getWalletBalance);
router.get("/history", protect, getWalletHistory);
router.post("/top-up", protect, topUpDemoWallet);
router.post("/withdraw", protect, withdrawDemoWallet);

export default router;
