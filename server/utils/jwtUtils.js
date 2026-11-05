const jwt = require('jsonwebtoken');

/**
 * Generate a signed JSON Web Token for the user.
 * @param {string} userId - User's MongoDB ObjectId
 * @returns {string} - Signed JWT
 */
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'fallback_development_secret_do_not_use_in_prod',
    { expiresIn: '7d' }
  );
};

/**
 * Get cookie options according to environment.
 * @returns {object} - Cookie configuration
 */
const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    path: '/',
  };
};

/**
 * Sends JWT in an HTTP-only cookie and returns user JSON.
 * @param {object} user - Mongoose user document
 * @param {number} statusCode - HTTP status code
 * @param {object} res - Express response object
 * @param {string} message - Response message
 */
const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const token = generateToken(user._id);
  const cookieOptions = getCookieOptions();

  res.cookie('token', token, cookieOptions);

  return res.status(statusCode).json({
    success: true,
    message,
    token, // Also provided in JSON for header fallback / automated API tests
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    },
  });
};

/**
 * Clears the authentication cookie on logout.
 * @param {object} res - Express response object
 */
const clearTokenCookie = (res) => {
  const cookieOptions = getCookieOptions();
  res.clearCookie('token', {
    ...cookieOptions,
    maxAge: 0,
  });
};

module.exports = {
  generateToken,
  getCookieOptions,
  sendTokenResponse,
  clearTokenCookie,
};

