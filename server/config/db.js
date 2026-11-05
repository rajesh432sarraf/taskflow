const mongoose = require('mongoose');

/**
 * Connect to MongoDB database.
 * If MONGO_URI is not provided in environment variables,
 * a clear warning is logged without crashing the process.
 */
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri || mongoUri.trim() === '') {
      console.warn('⚠️ Warning: MONGO_URI is not set in environment variables. Database connection skipped.');
      return false;
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    return false;
  }
};

module.exports = connectDB;

