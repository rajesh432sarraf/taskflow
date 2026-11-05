const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect routes by verifying JWT in HTTP-only cookie or Authorization header.
 * Attaches authenticated user object to req.user (excluding password).
 */
const protect = async (req, res, next) => {
  let token = null;

  // 1. Primary check: HTTP-only cookie
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // 2. Secondary check: Authorization header Bearer token (for automated testing / Axios fallback)
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // If no token found
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback_development_secret_do_not_use_in_prod'
    );

    // Fetch user from database
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, user no longer exists',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication verification error:', error.message);
    return res.status(401).json({
      success: false,
      message:
        error.name === 'TokenExpiredError'
          ? 'Not authorized, session expired. Please log in again.'
          : 'Not authorized, invalid token',
    });
  }
};

module.exports = { protect };

