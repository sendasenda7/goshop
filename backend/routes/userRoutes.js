const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
  uploadAvatar,
  getUserOrders,
  addToWishlist,
  removeFromWishlist,
  getWishlist
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Toutes les routes utilisateur nécessitent une authentification
router.use(protect);

router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.delete('/profile', deleteUserAccount);
router.post('/avatar', upload.single('avatar'), uploadAvatar);
router.get('/orders', getUserOrders);
router.get('/wishlist', getWishlist);
router.post('/wishlist', addToWishlist);
router.delete('/wishlist/:productId', removeFromWishlist);

module.exports = router;