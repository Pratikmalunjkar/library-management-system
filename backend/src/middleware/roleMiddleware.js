const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.user_role) {
      return res.status(403).json({ message: "Forbidden: No role found" });
    }

    if (!allowedRoles.includes(req.user.user_role)) {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }

    next();
  };
};

module.exports = authorizeRoles;