// Usage: router.get("/admin-only", protect, roleCheck("admin"), handler)
export const roleCheck = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Not authorized for this resource" });
    }
    next();
  };
};
