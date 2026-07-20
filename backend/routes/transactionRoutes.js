import express from "express";
import { protect } from "../middleware/auth.js";
import { purchaseEnergy, getMyTransactions } from "../controllers/transactionController.js";

const router = express.Router();

router.post("/purchase", protect, purchaseEnergy);
router.get("/mine", protect, getMyTransactions);

export default router;
