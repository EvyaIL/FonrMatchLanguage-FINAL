const express = require('express');
const passport = require('passport');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../../models/User');

// Log all requests to this router
router.use((req, res, next) => {
  console.log(`GOOGLE AUTH REQUEST: ${req.method} ${req.url}`);
  next();
});

// Initiate Google OAuth flow
router.get('/google', (req, res, next) => {
  console.log('Starting Google OAuth flow...');
  // Store origin page to redirect back after auth
  if (req.headers.referer) {
    req.session.returnTo = req.headers.referer;
  }
  
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false,
    prompt: 'select_account'
  })(req, res, next);
});

// Google OAuth callback route with multiple token delivery mechanisms
router.get('/google/callback', (req, res, next) => {
  console.log('Google Auth callback received');
  
  passport.authenticate('google', { session: false }, (err, user, info) => {
    if (err) {
      console.error('Google auth error:', err);
      return res.redirect(`/social-auth-success.html?error=${encodeURIComponent(err.message)}`);
    }
    
    if (!user) {
      console.log('No user returned from Google auth');
      return res.redirect('/social-auth-success.html?error=auth_failed');
    }
    
    try {
      console.log(`Google auth successful for user: ${user.email}`);
      
      // Generate JWT token
      const token = jwt.sign(
        { 
          id: user._id, 
          email: user.email,
          username: user.username,
          socialLogin: true 
        }, 
        process.env.JWT_SECRET || 'default_jwt_secret',
        { expiresIn: '7d' }
      );
      
      // Set multiple cookies with token
      // 1. HTTP-only cookie for API requests
      res.cookie('auth_token', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      
      // 2. JavaScript-accessible cookie for frontend
      res.cookie('auth_status', 'success', {
        httpOnly: false,
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
      
      // 3. Save user ID in another cookie for recovery mechanisms
      res.cookie('user_id', user._id.toString(), {
        httpOnly: false,
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
      
      // 4. Store in session
      req.session.userId = user._id;
      req.session.isAuthenticated = true;
      req.session.authMethod = 'google';
      
      // Record successful auth with timestamp
      user.lastLogin = Date.now();
      user.save().catch(err => console.error('Error updating last login:', err));
      
      // Log the complete object we're passing to the success page
      console.log('Auth success redirect with token:', token.substring(0, 10) + '...');
      
      // Redirect to success page with token in URL (multiple ways)
      // - In query param
      // - In hash fragment
      // - In cookies (already done above)
      const successUrl = `/social-auth-success.html?token=${encodeURIComponent(token)}&userId=${user._id.toString()}&email=${encodeURIComponent(user.email)}#token=${encodeURIComponent(token)}`;
      return res.redirect(successUrl);
    } catch (error) {
      console.error('Error in Google auth callback:', error);
      return res.redirect(`/social-auth-success.html?error=${encodeURIComponent(error.message)}`);
    }
  })(req, res, next);
});

// Debug endpoint to check auth status
router.get('/auth-status', (req, res) => {
  res.json({
    session: req.session ? {
      userId: req.session.userId,
      isAuthenticated: req.session.isAuthenticated,
      authMethod: req.session.authMethod
    } : null,
    cookies: {
      authToken: !!req.cookies.auth_token,
      authStatus: req.cookies.auth_status,
      userId: req.cookies.user_id
    }
  });
});

// Latest user endpoint - get the most recently logged in user
router.get('/latest-user', async (req, res) => {
  try {
    const latestUser = await User.findOne({})
      .sort({ lastLogin: -1 })
      .select('-password');
    
    if (!latestUser) {
      return res.status(404).json({ success: false, message: 'No users found' });
    }
    
    return res.json({
      success: true,
      user: {
        _id: latestUser._id,
        email: latestUser.email,
        username: latestUser.username,
        socialLogin: latestUser.socialLogin,
        socialProvider: latestUser.socialProvider,
        socialAvatar: latestUser.socialAvatar,
        lastLogin: latestUser.lastLogin
      }
    });
  } catch (error) {
    console.error('Error getting latest user:', error);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get a specific user by ID - for recovery
router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    return res.json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        socialLogin: user.socialLogin,
        socialProvider: user.socialProvider,
        socialAvatar: user.socialAvatar,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Error getting user:', error);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
