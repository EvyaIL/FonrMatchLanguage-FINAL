const express = require('express');
const passport = require('passport');
const {
  register,
  login,
  logout,
  getMe,
  updateDetails,
  updatePassword,
  socialLoginSuccess
} = require('../controllers/auth');

const router = express.Router();

const { protect } = require('../middleware/auth');

// Regular auth routes
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);

// Google OAuth routes
router.get('/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  socialLoginSuccess
);

// GitHub OAuth routes
router.get('/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/login', session: false }),
  socialLoginSuccess
);

// Microsoft OAuth routes
router.get('/microsoft',
  passport.authenticate('microsoft')
);

router.get('/microsoft/callback',
  passport.authenticate('microsoft', { failureRedirect: '/login' }),
  socialLoginSuccess
);

module.exports = router;
