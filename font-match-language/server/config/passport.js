const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Initialize passport
module.exports = function() {
  // Google Strategy
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/v1/auth/google/callback",
    scope: ['profile', 'email'],
    passReqToCallback: true // Allow access to request object
  }, async (req, accessToken, refreshToken, profile, done) => {
    try {
      console.log('Google auth callback triggered');
      
      // Store the access token in the session for later use
      if (!req.session) {
        req.session = {};
      }
      req.session.accessToken = accessToken;
      
      // Check if user already exists in our DB
      let user = await User.findOne({ email: profile.emails[0].value });
      
      if (user) {
        // If user exists but was registered via email, update to add social info
        if (!user.socialLogin) {
          user.socialLogin = true;
          user.socialProvider = 'google';
          user.socialId = profile.id;
          user.socialAvatar = profile.photos[0].value;
          await user.save();
        }
      } else {
        // Create new user
        user = await User.create({
          username: profile.displayName,
          email: profile.emails[0].value,
          socialLogin: true,
          socialProvider: 'google',
          socialId: profile.id,
          socialAvatar: profile.photos[0].value
        });
      }
      
      // Update last login
      user.lastLogin = Date.now();
      await user.save();
      
      // Generate JWT token that includes user info
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
      
      // Store token in user object for the callback
      user.token = token;
      
      console.log(`Google auth successful for: ${user.email}`);
      return done(null, user);
    } catch (error) {
      console.error('Google auth error:', error);
      return done(error, false);
    }
  }));
  
  // GitHub Strategy
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/api/v1/auth/github/callback",
    scope: ['user:email']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails && profile.emails[0] ? profile.emails[0].value : `${profile.username}@github.com`;
      
      let user = await User.findOne({ 
        $or: [
          { email: email },
          { socialId: profile.id, socialProvider: 'github' }
        ]
      });
      
      if (user) {
        if (!user.socialLogin) {
          user.socialLogin = true;
          user.socialProvider = 'github';
          user.socialId = profile.id;
          user.socialAvatar = profile.photos[0].value;
          await user.save();
        }
      } else {
        user = await User.create({
          username: profile.username || profile.displayName,
          email: email,
          socialLogin: true,
          socialProvider: 'github',
          socialId: profile.id,
          socialAvatar: profile.photos[0].value
        });
      }
      
      user.lastLogin = Date.now();
      await user.save();
      
      return done(null, user);
    } catch (error) {
      console.error('GitHub auth error:', error);
      return done(error, false);
    }
  }));

  // Serialization and Deserialization
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};
