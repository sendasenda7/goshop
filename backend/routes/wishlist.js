const express = require('express');
const router = express.Router();
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  moveAllToCart,
  clearWishlist,
} = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/', getWishlist);
router.post('/', addToWishlist);
router.post('/move-to-cart', moveAllToCart);
router.delete('/:productId', removeFromWishlist);
router.delete('/', clearWishlist);

module.exports = router;