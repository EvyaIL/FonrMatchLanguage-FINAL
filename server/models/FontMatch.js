const mongoose = require('mongoose');

const FontMatchSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sourceLanguage: {
    type: String,
    enum: ['en', 'he'],
    required: true
  },
  targetLanguage: {
    type: String,
    enum: ['en', 'he'],
    required: true
  },
  sourceFont: {
    type: String,
    required: true
  },
  targetFont: {
    type: String,
    required: true
  },
  sourceText: String,
  targetText: String,
  matchScore: Number,
  isFavorite: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('FontMatch', FontMatchSchema);
