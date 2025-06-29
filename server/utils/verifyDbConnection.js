const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

/**
 * Utility to test MongoDB connection outside of the main app
 * Run this with: node utils/verifyDbConnection.js
 */

// Basic connection options
const options = {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  useUnifiedTopology: true
};

async function verifyConnection() {
  console.log('Checking MongoDB connection...');
  
  // Get the URI from environment variables
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('MONGODB_URI environment variable is not set!');
    console.log('Available environment variables:', Object.keys(process.env).filter(key => !key.includes('SECRET')));
    process.exit(1);
  }
  
  console.log(`URI is: ${uri.substring(0, 20)}...${uri.includes('@') ? uri.substring(uri.indexOf('@')) : ''}`);
  
  try {
    // Attempt connection
    const conn = await mongoose.connect(uri, options);
    console.log(`MongoDB Connected successfully. Host: ${conn.connection.host}`);
    
    // Test a simple query
    await mongoose.connection.db.admin().ping();
    console.log('MongoDB ping successful!');
    
    // List all collections
    const collections = await mongoose.connection.db.collections();
    console.log(`Available collections: ${collections.map(c => c.collectionName).join(', ')}`);
    
    // Close connection
    await mongoose.connection.close();
    console.log('Test successful, connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('MongoDB connection test failed:', error);
    process.exit(1);
  }
}

verifyConnection();
