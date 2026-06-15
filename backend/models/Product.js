const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Nom produit requis'], trim: true },
  description: { type: String, required: [true, 'Description requise'] },
  price: { type: Number, required: [true, 'Prix requis'], min: 0 },
  oldPrice: { type: Number, default: 0 },
  category: { type: String, required: [true, 'Catégorie requise'] },
  brand: { type: String, default: '' },
  images: [{ type: String }],
  sizes: [{ type: String }],
  colors: [{ type: String }],
  stock: { type: Number, required: true, default: 0 },
  sold: { type: Number, default: 0 },
  reviews: [reviewSchema],
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  isNew: { type: Boolean, default: false },
  isSale: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);