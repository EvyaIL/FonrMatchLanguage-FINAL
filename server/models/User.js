const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    unique: true,
    sparse: true // Allows multiple documents to have a null value for this field
  },
  username: {
    type: String,
    required: [function() { return !this.googleId; }, 'Please provide a username'],
    unique: true,
    sparse: true,
    trim: true,
    maxlength: [30, 'Username cannot be more than 30 characters']
  },
  displayName: {
      type: String
  },
  picture: {
      type: String
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: function() {
      return !this.socialLogin; // Password only required if not social login
    },
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  socialLogin: {
    type: Boolean,
    default: false
  },
  socialProvider: {
    type: String,
    enum: ['google', 'github'] // Removed facebook and microsoft
  },
  socialId: String,
  socialAvatar: String,
  preferences: {
    defaultLanguage: {
      type: String,
      enum: ['en', 'he'],
      default: 'en'
    },
    darkMode: {
      type: Boolean,
      default: false
    },
    defaultSourceFont: String,
    defaultTargetFont: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  }
});

// Encrypt password using bcrypt (only for non-social logins)
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.socialLogin) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
