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
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Trust reverse proxy (Render, Vercel, Heroku, AWS) for secure HTTPS cookies and protocol detection
app.set('trust proxy', 1);

// Flexible CORS origin validation supporting configured URLs, localhost, and Vercel deployments
const isOriginAllowed = (origin) => {
  if (!origin) return true; // Allow non-browser, mobile, or same-origin requests

  const cleanOrigin = origin.trim().replace(/\/+$/, '');

  // 1. Explicitly configured client URLs
  const configured = [
    process.env.CLIENT_URL,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5000',
    'http://127.0.0.1:5000',
    'https://taskflow-one-lilac.vercel.app',
    'https://taskflow-three.vercel.app',
  ];

  if (process.env.CLIENT_URL && process.env.CLIENT_URL.includes(',')) {
    process.env.CLIENT_URL.split(',').forEach((u) => configured.push(u.trim()));
  }

  const normalizedConfigured = configured
    .filter(Boolean)
    .map((u) => u.trim().replace(/\/+$/, ''));

  if (normalizedConfigured.includes(cleanOrigin)) {
    return true;
  }

  // 2. Allow any localhost / loopback on any port
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(cleanOrigin)) {
    return true;
  }

  // 3. Allow any Vercel deployment domain (*.vercel.app)
  if (/^https:\/\/[a-z0-9-]+(\.[a-z0-9-]+)*\.vercel\.app$/.test(cleanOrigin)) {
    return true;
  }

  return false;
};

app.use(cors({
  origin: function (origin, callback) {
    if (isOriginAllowed(origin)) {
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
