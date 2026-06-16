const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Stats dashboard (chiffre d'affaires, commandes, clients, produits)
// @route   GET /api/admin/stats
const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalClients = await User.countDocuments({ role: 'user' });
    const totalProducts = await Product.countDocuments();
    const outOfStock = await Product.countDocuments({ stock: 0 });

    // Chiffre d'affaires total (commandes livrées ou payées)
    const revenueResult = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // Commandes par mois (année courante)
    const currentYear = new Date().getFullYear();
    const monthlyData = await Order.aggregate([
      { $match: { createdAt: { $gte: new Date(`${currentYear}-01-01`) } } },
      {
        $group: {
          _id: { $month: '$createdAt' },
          orders: { $sum: 1 },
          revenue: { $sum: '$totalPrice' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Formater les données mensuelles (12 mois)
    const months = ['Jan','Fev','Mar','Avr','Mai','Jun','Jul','Aou','Sep','Oct','Nov','Dec'];
    const chartData = months.map((month, i) => {
      const found = monthlyData.find(d => d._id === i + 1);
      return { month, orders: found?.orders || 0, revenue: found?.revenue || 0 };
    });

    // Commandes par jour (semaine courante)
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Lundi
    startOfWeek.setHours(0, 0, 0, 0);

    const weeklyData = await Order.aggregate([
      { $match: { createdAt: { $gte: startOfWeek } } },
      {
        $group: {
          _id: { $dayOfWeek: '$createdAt' },
          orders: { $sum: 1 }
        }
      }
    ]);

    const days = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];
    const weeklyChart = days.map((day, i) => {
      // MongoDB: 1=Dim, 2=Lun... donc Lun=2
      const mongoDay = i + 2 > 7 ? 1 : i + 2;
      const found = weeklyData.find(d => d._id === mongoDay);
      return { day, orders: found?.orders || 0 };
    });

    // Répartition par catégorie
    const categoryData = await Order.aggregate([
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      { $unwind: { path: '$productInfo', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$productInfo.category',
          total: { $sum: '$items.quantity' }
        }
      }
    ]);

    // Dernières commandes récentes
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email');

    res.json({
      stats: {
        totalRevenue,
        totalOrders,
        totalClients,
        totalProducts,
        outOfStock
      },
      chartData,
      weeklyChart,
      categoryData,
      recentOrders
    });
  } catch (error) {
    console.error('getDashboardStats error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Toutes les commandes
// @route   GET /api/admin/orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name email');
    res.json({ orders });
  } catch (error) {
    console.error('getAllOrders error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Tous les clients
// @route   GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' })
      .sort({ createdAt: -1 })
      .select('-password');
    res.json({ users });
  } catch (error) {
    console.error('getAllUsers error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Mettre à jour le statut d'une commande
// @route   PUT /api/admin/orders/:id
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const validStatuses = ['processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ message: 'Statut invalide' });
    }
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Commande non trouvée' });
    order.orderStatus = orderStatus;
    if (orderStatus === 'delivered') order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.json({ order: updatedOrder });
  } catch (error) {
    console.error('updateOrderStatus error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = { getDashboardStats, getAllOrders, getAllUsers, updateOrderStatus };