const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Register user
// @route   POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('Email déjà utilisé');
  }

  const user = await User.create({ name, email, password });
  const token = user.getSignedJwtToken();

  res.status(201).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      avatar: user.avatar || '',
      addresses: user.addresses || [],
      createdAt: user.createdAt,
    },
  });
});
// @desc    Login user
// @route   POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email et mot de passe requis');
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Email ou mot de passe incorrect');
  }

  const token = user.getSignedJwtToken();

  res.json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      avatar: user.avatar || '',
      addresses: user.addresses || [],
      createdAt: user.createdAt,
    },
  });
});

// @desc    Get current user
// @route   GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (!user) return res.status(404).json({ success: false, message: 'Utilisateur introuvable' });
  res.json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      avatar: user.avatar || '',
      addresses: user.addresses || [],
      wishlist: user.wishlist || [],
      createdAt: user.createdAt,
    }
  });
});

// @desc    Logout
// @route   GET /api/auth/logout
const logout = asyncHandler(async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.json({ success: true, message: 'Déconnecté avec succès' });
});

module.exports = { register, login, getMe, logout };