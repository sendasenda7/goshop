const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, adminOnly, asyncHandler(async (req, res) => {
  const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
  res.json({ success: true, users });
}));

router.get('/stats', protect, adminOnly, asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments({ role: 'user' });
  res.json({ success: true, totalUsers });
}));

module.exports = router;