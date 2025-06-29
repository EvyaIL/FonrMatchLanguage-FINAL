const express = require('express');
const {
  getFontMatches,
  getFavoriteFontMatches,
  saveFontMatch,
  toggleFavorite,
  deleteFontMatch
} = require('../controllers/fontMatches');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getFontMatches)
  .post(protect, saveFontMatch);

router.get('/favorites', protect, getFavoriteFontMatches);

router.route('/:id')
  .delete(protect, deleteFontMatch);

router.put('/:id/favorite', protect, toggleFavorite);

module.exports = router;
