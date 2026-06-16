const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { getDashboardStats, getAllOrders, getAllUsers, updateOrderStatus } = require('../controllers/adminController');

router.get('/stats', protect, admin, getDashboardStats);
router.get('/orders', protect, admin, getAllOrders);
router.put('/orders/:id', protect, admin, updateOrderStatus); // si vous voulez permettre la mise à jour statut via admin
router.get('/users', protect, admin, getAllUsers);

module.exports = router;