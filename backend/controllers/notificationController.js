import Notification from "../models/Notification.js";

// @route GET /api/notifications
export const getMyNotifications = async (req, res, next) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 100);
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(limit);
    const unreadCount = await Notification.countDocuments({ user: req.user._id, isRead: false });
    res.json({ notifications, unreadCount });
  } catch (err) {
    next(err);
  }
};

// @route PATCH /api/notifications/:id/read
export const markNotificationRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOne({ _id: req.params.id, user: req.user._id });
    if (!notification) return res.status(404).json({ message: "Notification not found" });
    notification.isRead = true;
    await notification.save();
    res.json(notification);
  } catch (err) {
    next(err);
  }
};

// @route POST /api/notifications/read-all
export const markAllNotificationsRead = async (req, res, next) => {
  try {
    const result = await Notification.updateMany(
      { user: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );
    res.json({ message: "All notifications marked as read", modified: result.modifiedCount });
  } catch (err) {
    next(err);
  }
};

// @route DELETE /api/notifications/:id
export const deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!notification) return res.status(404).json({ message: "Notification not found" });
    res.json({ message: "Notification deleted" });
  } catch (err) {
    next(err);
  }
};
