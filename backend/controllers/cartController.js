const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');

// @desc    Get cart
// @route   GET /api/cart
const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  res.json({ success: true, cart: cart || { items: [] } });
});

// @desc    Add to cart
// @route   POST /api/cart
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1, size, color } = req.body;

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  const itemIndex = cart.items.findIndex(
    item => item.product.toString() === productId && item.size === size
  );

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity, size, color });
  }

  await cart.save();
  await cart.populate('items.product');
  res.json({ success: true, cart });
});

// @desc    Remove from cart
// @route   DELETE /api/cart/:itemId
const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);
  await cart.save();
  res.json({ success: true, cart });
});

// @desc    Update quantity
// @route   PUT /api/cart/:itemId
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  const item = cart.items.find(item => item._id.toString() === req.params.itemId);
  if (item) item.quantity = quantity;
  await cart.save();
  await cart.populate('items.product');
  res.json({ success: true, cart });
});

// @desc    Clear cart
// @route   DELETE /api/cart
const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
  res.json({ success: true, message: 'Panier vidé' });
});

module.exports = { getCart, addToCart, removeFromCart, updateCartItem, clearCart };