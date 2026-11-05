const mongoose = require('mongoose');
const dns = require('dns');

// On Windows, some local ISP/router DNS servers fail on SRV queries for mongodb+srv URLs.
// Setting public DNS fallback ensures reliable MongoDB Atlas cluster discovery.
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Keep system default if setting custom DNS servers fails
}

// Prevent unhandled error events from Mongoose crashing the process
mongoose.connection.on('error', (err) => {
  console.error(`❌ MongoDB Runtime Error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  // Disconnected event handled cleanly
});

/**
 * Connect to MongoDB Atlas cluster via Mongoose.
 * Supports both MONGODB_URI and MONGO_URI environment variables.
 * Includes explicit diagnostics for:
 *  - Missing credentials / placeholders
 *  - Bad auth (invalid username/password)
 *  - IP whitelist / network access restrictions
 *  - Malformed connection string
 *  - Connection timeouts (5000ms limit)
 */
const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

  // Check if URI is missing
  if (!mongoUri || mongoUri.trim() === '') {
    console.warn('⚠️ Warning: MONGODB_URI is not set in environment variables. Database connection skipped.');
    return false;
  }

  // Check if URI still has unpopulated placeholders
  if (
    mongoUri.includes('<db_username>') || 
    mongoUri.includes('<db_password>') || 
    mongoUri.includes('<username>') || 
    mongoUri.includes('<password>')
  ) {
    console.warn('⚠️ Warning: MONGODB_URI contains placeholder values (<db_username> or <db_password>). Please update server/.env with your actual Atlas credentials.');
    return false;
  }

  // Check for basic URI scheme validity
  if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
    console.error('❌ Invalid Connection String: The URI must begin with mongodb:// or mongodb+srv://');
    return false;
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s if cluster unreachable
    });

    console.log('MongoDB Connected Successfully!');
    return true;
  } catch (error) {
    const msg = error.message || '';

    // 1. Invalid username or password (Code 8000 / Authentication failed)
    if (msg.includes('bad auth') || msg.includes('Authentication failed') || error.code === 8000) {
      console.error('❌ MongoDB Authentication Error: Invalid database username or password.');
      console.error('   👉 Check the <db_username> and <db_password> in your server/.env file.');
    }
    // 2. IP Whitelist / Network Access error (ENOTFOUND, ETIMEDOUT, querySrv, no servers reachable)
    else if (
      msg.includes('Could not connect to any servers') ||
      msg.includes('whitelist') ||
      msg.includes('ENOTFOUND') ||
      msg.includes('querySrv') ||
      error.name === 'MongooseServerSelectionError'
    ) {
      console.error('❌ MongoDB Network Access Error: Cannot connect to MongoDB Atlas cluster.');
      console.error('   👉 Ensure your current IP address is whitelisted in MongoDB Atlas under:');
      console.error('      Security -> Network Access -> Add IP Address -> Allow Access from Anywhere (0.0.0.0/0).');
    }
    // 3. Malformed URI or special characters
    else if (msg.includes('URI malformed') || msg.includes('Invalid connection string')) {
      console.error('❌ Invalid Connection String Error: The URI format is malformed.');
      console.error('   👉 If your password contains special characters (e.g. @, #, $, %), ensure they are URL-encoded.');
    }
    // 4. Timeout error
    else if (msg.includes('timed out') || msg.includes('timeout')) {
      console.error('❌ MongoDB Connection Timeout: Connection attempt timed out after 5000ms.');
      console.error('   👉 Check your internet connection and MongoDB Atlas cluster health.');
    }
    // General error fallback
    else {
      console.error(`❌ MongoDB Connection Error: ${msg}`);
    }

    return false;
  }
};

module.exports = connectDB;
