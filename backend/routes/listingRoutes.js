import express from "express";
import { createListing, getListings, getMyListings } from "../controllers/listingController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getListings); // public marketplace browse
router.get("/mine", protect, authorize("prosumer"), getMyListings);
router.post("/", protect, authorize("prosumer"), createListing);

export default router;
