const FontMatch = require('../models/FontMatch');

// @desc    Save a font match
// @route   POST /api/v1/fontmatches
// @access  Private
exports.saveFontMatch = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    
    const fontMatch = await FontMatch.create(req.body);
    
    res.status(201).json({
      success: true,
      data: fontMatch
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get all font matches for a user
// @route   GET /api/v1/fontmatches
// @access  Private
exports.getFontMatches = async (req, res, next) => {
  try {
    const fontMatches = await FontMatch.find({ user: req.user.id });
    
    res.status(200).json({
      success: true,
      count: fontMatches.length,
      data: fontMatches
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get favorite font matches
// @route   GET /api/v1/fontmatches/favorites
// @access  Private
exports.getFavoriteFontMatches = async (req, res, next) => {
  try {
    const fontMatches = await FontMatch.find({ 
      user: req.user.id,
      isFavorite: true
    });
    
    res.status(200).json({
      success: true,
      count: fontMatches.length,
      data: fontMatches
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Toggle favorite status of a match
// @route   PUT /api/v1/fontmatches/:id/favorite
// @access  Private
exports.toggleFavorite = async (req, res, next) => {
  try {
    let fontMatch = await FontMatch.findById(req.params.id);
    
    if (!fontMatch) {
      return res.status(404).json({ success: false, error: 'Font match not found' });
    }
    
    // Make sure user owns the font match
    if (fontMatch.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }
    
    // Toggle favorite status
    fontMatch.isFavorite = !fontMatch.isFavorite;
    await fontMatch.save();
    
    res.status(200).json({
      success: true,
      data: fontMatch
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Delete a font match
// @route   DELETE /api/v1/fontmatches/:id
// @access  Private
exports.deleteFontMatch = async (req, res, next) => {
  try {
    const fontMatch = await FontMatch.findById(req.params.id);
    
    if (!fontMatch) {
      return res.status(404).json({ success: false, error: 'Font match not found' });
    }
    
    // Make sure user owns the font match
    if (fontMatch.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }
    
    // Use findByIdAndDelete instead of remove() which is deprecated
    await FontMatch.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
