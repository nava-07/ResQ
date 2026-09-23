const roleCheck = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authorized, no user found' });
    }
    // Administrator has universal access to all routes
    if (req.user.role === 'admin' || roles.includes(req.user.role)) {
      return next();
    }
    return res.status(403).json({ success: false, message: `Role ${req.user.role} is not authorized to access this route` });
  };
};

module.exports = roleCheck;
