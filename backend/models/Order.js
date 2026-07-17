// backend/models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerName: String,
  customerEmail: String,
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  totalPrice: { type: Number, required: true },
  shippingCost: { type: Number, default: 0 },
  shippingAddress: { type: Object, required: true },
  paymentMethod: { type: String, required: true },
  
  paymentStatus: { type: String, default: 'pending' }, // pending, paid, failed, refunded
  orderStatus: { type: String, default: 'processing' }, // processing, shipped, delivered, cancelled
  paidAt: Date,
  paymentResult: {
    id: String,
    status: String,
    update_time: String,
    email_address: String
  },
  deliveredAt: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);