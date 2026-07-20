import express from "express";
import { protect, authorize } from "../middleware/auth.js";
import {
  getOverview,
  getAllUsers,
  toggleBlockUser,
  deleteUser,
  getAllListings,
  deleteListing,
  getAllTransactions,
  resolveDispute,
  getAllMeterReadings,
} from "../controllers/adminController.js";

const router = express.Router();

// All routes require admin auth
router.use(protect, authorize("admin"));

router.get("/overview",           getOverview);
router.get("/users",              getAllUsers);
router.patch("/users/:id/block",  toggleBlockUser);
router.delete("/users/:id",       deleteUser);
router.get("/listings",           getAllListings);
router.delete("/listings/:id",    deleteListing);
router.get("/transactions",       getAllTransactions);
router.patch("/transactions/:id/resolve", resolveDispute);
router.get("/meters",             getAllMeterReadings);

export default router;
