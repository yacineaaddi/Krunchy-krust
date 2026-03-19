export const requireDriver = (req, res, next) => {
  if (req.user.role !== "driver") {
    return res.status(403).json({ error: "Driver only" });
  }
  next();
};
