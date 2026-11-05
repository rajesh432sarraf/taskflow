/**
 * Centralized Error Handling Middleware
 * Ensures consistent JSON response structure and hides stack traces in production
 */
const errorHandler = (err, req, res, next) => {
  // If status code is 200, default to 500 internal server error
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;

