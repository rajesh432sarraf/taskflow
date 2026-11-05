const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

/**
 * @route   GET /api/health
 * @desc    System health check and database connection status
 * @access  Public
 */
router.get('/', (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    // Mongoose readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    const dbStatusMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    res.status(200).json({
      success: true,
      message: 'TaskFlow API is healthy and operational',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      database: dbStatusMap[dbState] || 'disconnected',
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Health check failed',
      error: err.message
    });
  }
});

module.exports = router;
