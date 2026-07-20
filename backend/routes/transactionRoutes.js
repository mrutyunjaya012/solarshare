import express from "express";
import { protect } from "../middleware/auth.js";
import {
  purchaseEnergy,
  getMyTransactions,
  getTransactionStats,
  getTransactionById,
  openDispute,
} from "../controllers/transactionController.js";

const router = express.Router();

router.post("/purchase", protect, purchaseEnergy);
router.get("/mine", protect, getMyTransactions);
router.get("/stats", protect, getTransactionStats);
router.get("/:id", protect, getTransactionById);
router.post("/:id/dispute", protect, openDispute);

export default router;
