const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

const getDashboardStats = async (req, res) => {
  // ... (contenu complet plus haut)
};

const getAllOrders = async (req, res) => {
  // ...
};

const getAllUsers = async (req, res) => {
  // ...
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Commande non trouvée' });
    order.orderStatus = orderStatus;
    if (orderStatus === 'delivered') order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.json({ order: updatedOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = { getDashboardStats, getAllOrders, getAllUsers, updateOrderStatus };