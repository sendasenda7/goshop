const User = require('../models/User');
const Order = require('../models/Order');

// @desc    Obtenir le profil utilisateur
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      avatar: user.avatar || '',
      addresses: user.addresses || [],
      wishlist: user.wishlist || [],
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error('getUserProfile error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Mettre à jour le profil utilisateur
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('+password');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    if (req.body.name !== undefined) user.name = req.body.name || user.name;
    if (req.body.email !== undefined) user.email = req.body.email || user.email;
    if (req.body.phone !== undefined) user.phone = req.body.phone;
    if (req.body.addresses !== undefined) user.addresses = req.body.addresses;

    if (req.body.password) {
      if (!req.body.currentPassword) {
        return res.status(400).json({ message: 'Mot de passe actuel requis' });
      }
      const isMatch = await user.matchPassword(req.body.currentPassword);
      if (!isMatch) {
        return res.status(401).json({ message: 'Mot de passe actuel incorrect' });
      }
      user.password = req.body.password; // pre-save hook hash automatiquement
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone || '',
      addresses: updatedUser.addresses,
      role: updatedUser.role,
      createdAt: updatedUser.createdAt,
    });
  } catch (error) {
    console.error('updateUserProfile error:', error);
    // Doublon sur un champ unique (typiquement l'email déjà utilisé par un autre compte)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || 'champ';
      const label = field === 'email' ? 'Cet email est déjà utilisé par un autre compte' : `Cette valeur est déjà utilisée (${field})`;
      return res.status(400).json({ message: label });
    }
    res.status(500).json({ message: error.message || 'Erreur serveur' });
  }
};

// @desc    Supprimer le compte utilisateur
// @route   DELETE /api/users/profile
// @access  Private
const deleteUserAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ message: 'Compte supprimé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Obtenir les commandes de l'utilisateur
// @route   GET /api/users/orders
// @access  Private
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Obtenir la wishlist
// @route   GET /api/users/wishlist
// @access  Private
const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist', 'name price images stock isNew isSale');
    res.json(user?.wishlist || []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Ajouter un produit à la wishlist
// @route   POST /api/users/wishlist
// @access  Private
const addToWishlist = async (req, res) => {
  const { productId } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }
    res.json({ message: 'Produit ajouté à la wishlist', wishlist: user.wishlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Retirer un produit de la wishlist
// @route   DELETE /api/users/wishlist/:productId
// @access  Private
const removeFromWishlist = async (req, res) => {
  const { productId } = req.params;
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    await user.save();
    res.json({ message: 'Produit retiré de la wishlist', wishlist: user.wishlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Upload photo de profil
// @route   POST /api/users/avatar
// @access  Private
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier envoyé' });
    }
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    const user = await User.findById(req.user._id);
    user.avatar = avatarUrl;
    await user.save();
    res.json({ avatar: avatarUrl });
  } catch (error) {
    console.error('uploadAvatar error:', error);
    res.status(500).json({ message: 'Erreur lors de l\'upload' });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
  uploadAvatar,
  getUserOrders,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};