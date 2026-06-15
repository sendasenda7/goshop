const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
const getProducts = asyncHandler(async (req, res) => {
  const { category, search, sort, minPrice, maxPrice, page = 1, limit = 12 } = req.query;

  let query = {};

  if (category) query.category = category;
  if (search) query.name = { $regex: search, $options: 'i' };
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  let sortOption = {};
  if (sort === 'price-asc') sortOption = { price: 1 };
  else if (sort === 'price-desc') sortOption = { price: -1 };
  else if (sort === 'newest') sortOption = { createdAt: -1 };
  else if (sort === 'rating') sortOption = { rating: -1 };

  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .sort(sortOption)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({
    success: true,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    products,
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('reviews.user', 'name avatar');
  if (!product) {
    res.status(404);
    throw new Error('Produit introuvable');
  }
  res.json({ success: true, product });
});

// @desc    Create product
// @route   POST /api/products
const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
});

// @desc    Update product
// @route   PUT /api/products/:id
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    res.status(404);
    throw new Error('Produit introuvable');
  }
  res.json({ success: true, product });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Produit introuvable');
  }
  res.json({ success: true, message: 'Produit supprimé' });
});

// @desc    Add review
// @route   POST /api/products/:id/reviews
const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Produit introuvable');
  }

  const alreadyReviewed = product.reviews.find(
    r => r.user.toString() === req.user._id.toString()
  );
  if (alreadyReviewed) {
    res.status(400);
    throw new Error('Produit déjà évalué');
  }

  const review = { user: req.user._id, name: req.user.name, rating: Number(rating), comment };
  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

  await product.save();
  res.status(201).json({ success: true, message: 'Avis ajouté' });
});

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct, addReview };