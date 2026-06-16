// backend/models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  totalPrice: { type: Number, required: true },
  shippingAddress: { type: Object, required: true },
  paymentMethod: { type: String, required: true },
  paymentStatus: { type: String, default: 'pending' }, // pending, paid, failed
  orderStatus: { type: String, default: 'processing' }, // processing, shipped, delivered, cancelled
  paidAt: Date,
  deliveredAt: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);