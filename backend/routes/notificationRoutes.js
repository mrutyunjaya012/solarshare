import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", protect, getMyNotifications);
router.post("/read-all", protect, markAllNotificationsRead);
router.patch("/:id/read", protect, markNotificationRead);
router.delete("/:id", protect, deleteNotification);

export default router;
