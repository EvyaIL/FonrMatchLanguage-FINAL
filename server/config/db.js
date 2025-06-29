const mongoose = require('mongoose');
require('dotenv').config();

// Enhanced connection options
const connectionOptions = {
  serverSelectionTimeoutMS: 60000, // Increase to 60 seconds
  socketTimeoutMS: 75000,
  connectTimeoutMS: 60000,
  maxIdleTimeMS: 180000, // Keep idle connections longer
  heartbeatFrequencyMS: 5000, // Check more frequently
  maxPoolSize: 10, // Increase connection pool size
  minPoolSize: 2, // Ensure minimum connections
  autoIndex: false, // Don't build indexes
  family: 4, // Force IPv4
  useUnifiedTopology: true, // Use new connection management engine
};

// Function to connect to MongoDB with robust retry mechanism
const connectDB = async () => {
  // Set up connection events before attempting to connect
  mongoose.connection.on('connecting', () => {
    console.log('MongoDB: connecting...');
  });

  mongoose.connection.on('connected', () => {
    console.log('MongoDB: connected.');
  });

  mongoose.connection.on('open', () => {
    console.log('MongoDB: connection open.');
  });

  mongoose.connection.on('disconnecting', () => {
    console.log('MongoDB: disconnecting...');
  });

  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB: disconnected.');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('MongoDB: reconnected.');
  });

  mongoose.connection.on('error', (error) => {
    console.error(`MongoDB connection error: ${error}`);
  });

  // Set mongoose options globally
  mongoose.set('strictQuery', false);

  let connectionAttempts = 0;
  const maxRetries = 5;
  const retryInterval = 5000; // 5 seconds

  // Function to attempt connection with retry logic
  const attemptConnection = async () => {
    try {
      connectionAttempts++;
      console.log(`MongoDB connection attempt ${connectionAttempts} of ${maxRetries}`);
      console.log(`Attempting to connect to MongoDB with URI: ${process.env.MONGODB_URI ? 'URI is set' : 'URI is NOT SET'}`);
      
      // Check if MongoDB URI is provided, if not use a default local URI
      const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/font_match_db';
      
      // Clear any existing connections
      if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
      }
      
      // Attempt connection with enhanced options
      const conn = await mongoose.connect(uri, connectionOptions);

      console.log(`MongoDB Connected successfully. Host: ${conn.connection.host}`);
      
      // Test connection with a simple query
      await mongoose.connection.db.admin().ping();
      console.log("MongoDB connection verified with ping.");
      
      return conn;
    } catch (error) {
      console.error(`Error connecting to MongoDB (attempt ${connectionAttempts}): ${error.message}`);
      
      // If we haven't reached max retries, try again
      if (connectionAttempts < maxRetries) {
        console.log(`Retrying connection in ${retryInterval/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, retryInterval));
        return attemptConnection();
      } else {
        console.error(`Failed to connect to MongoDB after ${maxRetries} attempts.`);
        throw error;
      }
    }
  };

  return attemptConnection();
};

module.exports = connectDB;
