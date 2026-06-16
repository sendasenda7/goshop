const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  getUserOrders,
  addToWishlist,
  removeFromWishlist,
  getWishlist
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Toutes les routes utilisateur nécessitent une authentification
router.use(protect);

router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.get('/orders', getUserOrders);
router.get('/wishlist', getWishlist);
router.post('/wishlist', addToWishlist);
router.delete('/wishlist/:productId', removeFromWishlist);

module.exports = router;