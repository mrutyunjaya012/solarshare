import express from "express";
import {
  createListing,
  getListings,
  getMyListings,
  getMyListingStats,
  getListingById,
  updateListing,
  cancelListing,
} from "../controllers/listingController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getListings);
router.get("/mine", protect, authorize("prosumer"), getMyListings);
router.get("/stats/mine", protect, authorize("prosumer"), getMyListingStats);
router.post("/", protect, authorize("prosumer"), createListing);
router.get("/:id", getListingById);
router.patch("/:id", protect, authorize("prosumer"), updateListing);
router.post("/:id/cancel", protect, authorize("prosumer"), cancelListing);

export default router;
