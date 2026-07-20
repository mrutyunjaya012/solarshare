import Notification from "../models/Notification.js";

export const createNotification = async ({ user, type, title, message, relatedId }) => {
  return Notification.create({ user, type, title, message, relatedId });
};
