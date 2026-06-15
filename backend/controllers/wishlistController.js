const asyncHandler = require('express-async-handler');
const Wishlist = require('../models/Wishlist');
const Cart = require('../models/Cart');

// @desc    Get wishlist
// @route   GET /api/wishlist
const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id }).populate('items.product');
  res.json({ success: true, wishlist: wishlist || { items: [] } });
});

// @desc    Add to wishlist
// @route   POST /api/wishlist
const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, items: [] });
  }

  const alreadyExists = wishlist.items.find(
    item => item.product.toString() === productId
  );

  if (!alreadyExists) {
    wishlist.items.push({ product: productId });
    await wishlist.save();
  }

  await wishlist.populate('items.product');
  res.json({ success: true, wishlist });
});

// @desc    Remove from wishlist
// @route   DELETE /api/wishlist/:productId
const removeFromWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id });
  wishlist.items = wishlist.items.filter(
    item => item.product.toString() !== req.params.productId
  );
  await wishlist.save();
  await wishlist.populate('items.product');
  res.json({ success: true, wishlist });
});

// @desc    Move all wishlist items to cart
// @route   POST /api/wishlist/move-to-cart
const moveAllToCart = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id }).populate('items.product');

  if (!wishlist || wishlist.items.length === 0) {
    return res.status(400).json({ success: false, message: 'Wishlist vide' });
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  for (const item of wishlist.items) {
    const product = item.product;
    if (!product) continue;

    const alreadyInCart = cart.items.find(
      ci => ci.product.toString() === product._id.toString()
    );

    if (!alreadyInCart) {
      cart.items.push({
        product: product._id,
        quantity: 1,
        size: product.sizes?.[0] || '',
        color: product.colors?.[0] || '',
      });
    }
  }

  await cart.save();
  await cart.populate('items.product');

  // Vider la wishlist
  wishlist.items = [];
  await wishlist.save();

  res.json({ success: true, cart, wishlist });
});

// @desc    Clear wishlist
// @route   DELETE /api/wishlist
const clearWishlist = asyncHandler(async (req, res) => {
  await Wishlist.findOneAndUpdate({ user: req.user._id }, { items: [] });
  res.json({ success: true, message: 'Wishlist vidée' });
});

module.exports = { getWishlist, addToWishlist, removeFromWishlist, moveAllToCart, clearWishlist };