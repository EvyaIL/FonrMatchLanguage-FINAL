const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

// Initialize passport
module.exports = function() {
  // Google Strategy
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/v1/auth/google/callback",
    scope: ['profile', 'email']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists in our DB
      let user = await User.findOne({ email: profile.emails[0].value });
      
      const userData = {
          displayName: profile.displayName,
          picture: profile.photos?.[0]?.value,
          googleId: profile.id,
          socialLogin: true,
          socialProvider: 'google'
      };

      if (user) {
        // Update existing user with Google data
        user = await User.findByIdAndUpdate(user._id, { $set: userData }, { new: true });
      } else {
        // Create new user
        userData.email = profile.emails[0].value;
        user = await User.create(userData);
      }
      
      // Update last login
      user.lastLogin = Date.now();
      await user.save();
      
      return done(null, user);
    } catch (error) {
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
      return done(error, false);
    }
  }));
  
  // Commented out Microsoft Strategy as per requirement
  /*
  passport.use(new MicrosoftStrategy({
    clientID: process.env.MICROSOFT_CLIENT_ID,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
    callbackURL: "/api/v1/auth/microsoft/callback",
    scope: ['user.read']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ email: profile.emails[0].value });
      
      if (user) {
        if (!user.socialLogin) {
          user.socialLogin = true;
          user.socialProvider = 'microsoft';
          user.socialId = profile.id;
          user.socialAvatar = profile._json.avatar || '';
          await user.save();
        }
      } else {
        user = await User.create({
          username: profile.displayName,
          email: profile.emails[0].value,
          socialLogin: true,
          socialProvider: 'microsoft',
          socialId: profile.id,
          socialAvatar: profile._json.avatar || ''
        });
      }
      
      user.lastLogin = Date.now();
      await user.save();
      
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }));
  */

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
