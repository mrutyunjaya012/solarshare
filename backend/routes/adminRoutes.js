import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import {
  getOverview,
  getAllUsers,
  toggleBlockUser,
  deleteUser,
  verifyUser,
  getAllListings,
  deleteListing,
  getAllTransactions,
  resolveDispute,
  getAllMeterReadings,
  getAllDisputes,
  resolveDisputeCase,
  getAllCarbonCredits,
} from "../controllers/adminController.js";

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/overview", getOverview);
router.get("/users", getAllUsers);
router.patch("/users/:id/block", toggleBlockUser);
router.patch("/users/:id/verify", verifyUser);
router.delete("/users/:id", deleteUser);
router.get("/listings", getAllListings);
router.delete("/listings/:id", deleteListing);
router.get("/transactions", getAllTransactions);
router.patch("/transactions/:id/resolve", resolveDispute);
router.get("/meters", getAllMeterReadings);
router.get("/disputes", getAllDisputes);
router.patch("/disputes/:id", resolveDisputeCase);
router.get("/carbon", getAllCarbonCredits);

export default router;
