const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const healthRoutes = require('./routes/healthRoutes');

// Load environment variables
dotenv.config();

const app = express();

// Database connection
connectDB();

// CORS configuration - explicit client origin with credentials allowed
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes
app.use('/api/health', healthRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'TaskFlow Backend API is running'
  });
});

// 404 & Centralized Error Handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start server function with error listeners and graceful shutdown
const startServer = (port = PORT) => {
  const serverInstance = app.listen(port, () => {
    console.log(`🚀 TaskFlow server running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
  });

  // Handle server-level errors (e.g. port already in use)
  serverInstance.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Port ${port} is already in use. Please terminate any running node processes on port ${port}.`);
    } else {
      console.error(`❌ Server error: ${err.message}`);
    }
    process.exit(1);
  });

  return serverInstance;
};

// Global process error handlers
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Promise Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
});

// Graceful shutdown handlers
let server = null;
const handleShutdown = (signal) => {
  console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
  if (server) {
    server.close(() => {
      console.log('✅ HTTP server closed.');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

// Only start listening if run directly (prevents duplicate servers when required by tests)
if (require.main === module) {
  server = startServer();
}

module.exports = { app, startServer };
