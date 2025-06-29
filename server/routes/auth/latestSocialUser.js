/**
 * Latest Social User API
 * This endpoint retrieves the most recently logged in social user
 */

const express = require('express');
const router = express.Router();
const User = require('../../models/User');

// Get the most recent social login user
router.get('/api/v1/auth/users/latest', async (req, res) => {
  try {
    // Check if we're looking specifically for social users
    const socialOnly = req.query.social === 'true';
    
    let query = {};
    if (socialOnly) {
      query.socialLogin = true;
    }
    
    // Find the most recently logged in user (or created if no login time)
    const latestUser = await User.findOne(query)
      .sort({ lastLogin: -1, createdAt: -1 })
      .exec();
    
    if (!latestUser) {
      return res.status(404).json({
        success: false,
        message: 'No users found'
      });
    }
    
    // Don't return password
    const userObj = latestUser.toObject();
    delete userObj.password;
    
    return res.status(200).json({
      success: true,
      message: 'Latest user retrieved successfully',
      data: userObj
    });
  } catch (error) {
    console.error('Error getting latest user:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while retrieving latest user'
    });
  }
});

// Get all social login users
router.get('/api/v1/auth/users/social', async (req, res) => {
  try {
    // Find all social login users
    const socialUsers = await User.find({ socialLogin: true })
      .sort({ lastLogin: -1, createdAt: -1 })
      .select('-password') // Exclude password field
      .exec();
    
    return res.status(200).json({
      success: true,
      message: 'Social users retrieved successfully',
      data: socialUsers
    });
  } catch (error) {
    console.error('Error getting social users:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while retrieving social users'
    });
  }
});

module.exports = router;
