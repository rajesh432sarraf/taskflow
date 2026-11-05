const path = require('path');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

// Load environment variables reliably from server/.env or parent
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config(); // fallback to default
const connectDB = require('./config/db');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

// Route Handlers
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// CORS configuration - supports explicit client URL, localhost, and 127.0.0.1 with credentials
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS policy: Origin ${origin} not allowed`));
  },
  credentials: true,
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'TaskFlow Backend API is running',
  });
});

// 404 & Centralized Error Handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start server function with error listeners and graceful shutdown
const startServer = async (port = PORT) => {
  // Execute database connection before starting the Express server
  await connectDB();

  const serverInstance = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
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
  startServer().then((s) => {
    server = s;
  });
}

module.exports = { app, startServer };
