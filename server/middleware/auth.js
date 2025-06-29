const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes with improved error handling and timeouts
exports.protect = async (req, res, next) => {
  let token;

  try {
    // Extract token from authorization header or cookies
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Set token from Bearer token in header
      token = req.headers.authorization.split(' ')[1];
    } 
    // For cookie named 'auth_token' (set in Google callback)
    else if (req.cookies?.auth_token) {
      token = req.cookies.auth_token;
    }

    // Make sure token exists
    if (!token) {
      return res.status(401).json({ success: false, error: 'Not authorized to access this route (no token)' });
    }

    try {
      // Verify token with fallback secret
      const secret = process.env.JWT_SECRET || 'default_jwt_secret';
      const decoded = jwt.verify(token, secret);
      
      // Set timeout for database query
      const findUserPromise = User.findById(decoded.id);
      
      // Add a timeout to the query
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Database query timed out while finding user'));
        }, 15000); // 15 seconds timeout
      });
      
      // Race the DB query against the timeout
      const user = await Promise.race([findUserPromise, timeoutPromise]);
      
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          error: 'User not found with this ID' 
        });
      }

      req.user = user;
      next();
    } catch (verifyError) {
      if (verifyError.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, error: 'Token expired, please log in again' });
      }
      
      console.error('Token validation error:', verifyError);
      return res.status(401).json({ success: false, error: 'Not authorized to access this route (token validation failed)' });
    }
  } catch (err) {
    console.error('Authentication error:', err);
    return res.status(500).json({ success: false, error: 'Server authentication error' });
  }
};
