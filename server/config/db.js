const mongoose = require('mongoose');

// Prevent unhandled error events from Mongoose crashing the process
mongoose.connection.on('error', (err) => {
  console.error(`❌ MongoDB Runtime Error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  // Disconnected event handled cleanly without throwing
});

/**
 * Connect to MongoDB database.
 * If MONGO_URI is missing, logs a safe warning without throwing or crashing.
 */
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri || mongoUri.trim() === '') {
      console.warn('⚠️ Warning: MONGO_URI is not set. Database connection skipped.');
      return false;
    }

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    return false;
  }
};

module.exports = connectDB;
