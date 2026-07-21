import express from "express";
import { protect } from "../middleware/auth.js";
import { matchListings } from "../controllers/matchController.js";

const router = express.Router();

router.post("/", protect, matchListings);

export default router;