// backend/controllers/orderController.js
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Créer une commande à partir du panier
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  // On ignore req.body.totalPrice, on le calcule nous-mêmes
  try {
    // 1. Récupérer le panier de l'utilisateur
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Votre panier est vide' });
    }

    let totalPrice = 0;
    const orderItems = [];

    // 2. Vérifier le stock pour chaque produit et calculer le total
    for (const item of cart.items) {
      const product = item.product;
      const quantity = item.quantity;

      if (product.stock < quantity) {
        return res.status(400).json({
          message: `Stock insuffisant pour ${product.name}. Disponible : ${product.stock}`,
        });
      }

      totalPrice += product.price * quantity;
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.image,
      });
    }

    // 3. Créer la commande (sans décrémenter le stock immédiatement pour éviter la double vente si erreur)
    const order = new Order({
      user: req.user._id,
      items: orderItems,
      totalPrice,
      shippingAddress: req.body.shippingAddress, // vient du frontend
      paymentMethod: req.body.paymentMethod,
      isPaid: false,
    });

    // 4. Décrémenter le stock de chaque produit (opération atomique)
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    await order.save();

    // 5. Vider le panier après commande réussie
    await Cart.findOneAndDelete({ user: req.user._id });

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur lors de la création de la commande' });
  }
};

// @desc    Obtenir toutes les commandes de l'utilisateur
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Obtenir une commande par ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    // Vérifier que l'utilisateur est propriétaire ou admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Non autorisé' });
    }
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Mettre à jour le statut de paiement (webhook ou route admin)
// @route   PUT /api/orders/:id/pay
// @access  Private/Admin
const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = { createOrder, getMyOrders, getOrderById, updateOrderToPaid };