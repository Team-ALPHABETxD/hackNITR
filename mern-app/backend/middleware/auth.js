const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret_in_env';

// Middleware to verify JWT and attach user info to req.user
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Authorization token missing' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    // payload should include { id, role }
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
};

// Role-based check middleware factory
const requireRole = (role) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ success: false, error: 'Not authenticated' });
  if (Array.isArray(role)) {
    if (!role.includes(req.user.role)) return res.status(403).json({ success: false, error: 'Forbidden' });
    return next();
  }
  if (req.user.role !== role) return res.status(403).json({ success: false, error: 'Forbidden' });
  next();
};

module.exports = {
  authenticate,
  requireRole
};
