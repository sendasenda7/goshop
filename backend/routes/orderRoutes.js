const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Toutes les routes nécessitent une authentification
router.use(protect);

router.post('/', createOrder);
router.get('/myorders', getMyOrders);
router.get('/:id', getOrderById);
router.get('/', adminOnly, getAllOrders);
router.put('/:id', adminOnly, updateOrderStatus);

module.exports = router;