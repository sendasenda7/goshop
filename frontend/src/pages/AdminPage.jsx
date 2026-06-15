import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  FiGrid, FiShoppingBag, FiUsers, FiPackage,
  FiTrendingUp, FiPlus, FiEdit2, FiTrash2,
  FiEye, FiMenu, FiX, FiLogOut, FiSettings,
  FiArrowUp, FiArrowDown, FiAlertCircle, FiRefreshCw,
  FiMail, FiPhone, FiCalendar
} from 'react-icons/fi';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// ─── Mock data pour charts (statique) ─────────────────────────────────────
const revenueData = [
  { month: 'Jan', revenue: 12400, orders: 48 },
  { month: 'Fev', revenue: 18200, orders: 62 },
  { month: 'Mar', revenue: 15800, orders: 55 },
  { month: 'Avr', revenue: 22100, orders: 78 },
  { month: 'Mai', revenue: 19500, orders: 71 },
  { month: 'Jun', revenue: 28400, orders: 95 },
  { month: 'Jul', revenue: 24600, orders: 88 },
  { month: 'Aou', revenue: 31200, orders: 104 },
  { month: 'Sep', revenue: 27800, orders: 96 },
  { month: 'Oct', revenue: 35400, orders: 118 },
  { month: 'Nov', revenue: 42100, orders: 135 },
  { month: 'Dec', revenue: 48250, orders: 142 },
];
const categoryData = [
  { name: 'Femme', value: 48, color: '#c9a96e' },
  { name: 'Homme', value: 24, color: '#0a0a0a' },
  { name: 'Cadeaux', value: 18, color: '#888888' },
  { name: 'Collections', value: 10, color: '#d4b896' },
];
const weeklyData = [
  { day: 'Lun', ventes: 8 }, { day: 'Mar', ventes: 12 },
  { day: 'Mer', ventes: 6 }, { day: 'Jeu', ventes: 15 },
  { day: 'Ven', ventes: 22 }, { day: 'Sam', ventes: 31 },
  { day: 'Dim', ventes: 18 },
];

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <FiGrid size={18} /> },
  { id: 'products', label: 'Produits', icon: <FiShoppingBag size={18} /> },
  { id: 'orders', label: 'Commandes', icon: <FiPackage size={18} /> },
  { id: 'customers', label: 'Clients', icon: <FiUsers size={18} /> },
  { id: 'settings', label: 'Parametres', icon: <FiSettings size={18} /> },
];

// orderStatus (backend: processing/shipped/delivered/cancelled) → label FR
const ORDER_STATUS_LABELS = {
  processing: 'Traitement',
  shipped: 'Expédition',
  delivered: 'Livré',
  cancelled: 'Annulé',
};
const ORDER_STATUS_COLORS = {
  processing: 'bg-yellow-50 text-yellow-600',
  shipped: 'bg-blue-50 text-blue-500',
  delivered: 'bg-green-50 text-green-600',
  cancelled: 'bg-red-50 text-red-500',
};
const statusColors = {
  actif: 'bg-green-50 text-green-600',
  rupture: 'bg-red-50 text-red-500',
};

const EMPTY_FORM = {
  name: '', description: '', category: 'Femme', price: '', oldPrice: '',
  stock: '', sizes: '', colors: '', images: '', isNew: false, isSale: false,
};

// ─── Tooltip chart ─────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gs-black text-white px-4 py-3 rounded-xl shadow-xl text-xs">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>
            {p.name}: {p.value}{p.name === 'Revenue (TND)' ? ' TND' : ''}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── Modal Produit ─────────────────────────────────────────────────────────
const ProductModal = ({ product, onClose, onSave }) => {
  const [form, setForm] = useState(
    product
      ? {
          ...product,
          sizes: product.sizes?.join(', ') || '',
          colors: product.colors?.join(', ') || '',
          images: product.images?.join(', ') || '',
        }
      : EMPTY_FORM
  );
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        oldPrice: Number(form.oldPrice) || 0,
        stock: Number(form.stock),
        sizes: form.sizes ? form.sizes.split(',').map((s) => s.trim()).filter(Boolean) : [],
        colors: form.colors ? form.colors.split(',').map((c) => c.trim()).filter(Boolean) : [],
        images: form.images ? form.images.split(',').map((i) => i.trim()).filter(Boolean) : [],
      };
      if (product) {
        const res = await api.put(`/products/${product._id}`, payload);
        toast.success('Produit mis à jour !');
        onSave(res.data.product);
      } else {
        const res = await api.post('/products', payload);
        toast.success('Produit ajouté !');
        onSave(res.data.product);
      }
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="fixed inset-0 bg-black/50 z-50" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-2xl p-8 z-50 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm tracking-widest uppercase font-semibold">
            {product ? 'Modifier le Produit' : 'Ajouter un Produit'}
          </h3>
          <button onClick={onClose}><FiX size={18} className="text-gs-gray hover:text-gs-black transition-colors" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-tag mb-2 block">Nom du produit *</label>
            <input name="name" value={form.name} onChange={handleChange} required
              placeholder="Ex: The Dome"
              className="w-full border border-black/20 px-4 py-3 text-sm outline-none focus:border-gs-black transition-colors font-light" />
          </div>
          <div>
            <label className="label-tag mb-2 block">Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange} required
              rows={3} placeholder="Description du produit..."
              className="w-full border border-black/20 px-4 py-3 text-sm outline-none focus:border-gs-black transition-colors font-light resize-none" />
          </div>
          <div>
            <label className="label-tag mb-2 block">Catégorie *</label>
            <select name="category" value={form.category} onChange={handleChange}
              className="w-full border border-black/20 px-4 py-3 text-sm outline-none focus:border-gs-black transition-colors font-light bg-white">
              {['Femme', 'Homme', 'Cadeaux', 'Collections'].map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-tag mb-2 block">Prix (TND) *</label>
              <input name="price" type="number" value={form.price} onChange={handleChange} required
                placeholder="0"
                className="w-full border border-black/20 px-4 py-3 text-sm outline-none focus:border-gs-black transition-colors font-light" />
            </div>
            <div>
              <label className="label-tag mb-2 block">Ancien prix (TND)</label>
              <input name="oldPrice" type="number" value={form.oldPrice} onChange={handleChange}
                placeholder="0"
                className="w-full border border-black/20 px-4 py-3 text-sm outline-none focus:border-gs-black transition-colors font-light" />
            </div>
          </div>
          <div>
            <label className="label-tag mb-2 block">Stock *</label>
            <input name="stock" type="number" value={form.stock} onChange={handleChange} required
              placeholder="0"
              className="w-full border border-black/20 px-4 py-3 text-sm outline-none focus:border-gs-black transition-colors font-light" />
          </div>
          <div>
            <label className="label-tag mb-2 block">Images (URLs séparées par virgule)</label>
            <input name="images" value={form.images} onChange={handleChange}
              placeholder="https://... , https://..."
              className="w-full border border-black/20 px-4 py-3 text-sm outline-none focus:border-gs-black transition-colors font-light" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-tag mb-2 block">Tailles</label>
              <input name="sizes" value={form.sizes} onChange={handleChange}
                placeholder="S, M, L, XL"
                className="w-full border border-black/20 px-4 py-3 text-sm outline-none focus:border-gs-black transition-colors font-light" />
            </div>
            <div>
              <label className="label-tag mb-2 block">Couleurs</label>
              <input name="colors" value={form.colors} onChange={handleChange}
                placeholder="noir, beige, rouge"
                className="w-full border border-black/20 px-4 py-3 text-sm outline-none focus:border-gs-black transition-colors font-light" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input name="isNew" type="checkbox" checked={form.isNew} onChange={handleChange}
                className="accent-gs-gold w-4 h-4" />
              <span className="text-xs font-light">Nouveau</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input name="isSale" type="checkbox" checked={form.isSale} onChange={handleChange}
                className="accent-gs-gold w-4 h-4" />
              <span className="text-xs font-light">En solde</span>
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 btn-outline-black">Annuler</button>
            <button type="submit" disabled={loading} className="flex-1 btn-gold disabled:opacity-60">
              {loading ? 'Chargement...' : product ? 'Mettre à jour' : 'Ajouter'}
            </button>
          </div>
        </form>
      </motion.div>
    </>
  );
};

// ─── Modal Suppression ─────────────────────────────────────────────────────
const DeleteModal = ({ product, onClose, onConfirm }) => (
  <>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose} className="fixed inset-0 bg-black/50 z-50" />
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-2xl p-8 z-50 text-center"
    >
      <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <FiAlertCircle size={22} className="text-red-500" />
      </div>
      <h3 className="text-sm font-semibold tracking-wide mb-2">Supprimer le produit ?</h3>
      <p className="text-xs text-gs-gray font-light mb-6">"{product.name}" sera définitivement supprimé.</p>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 btn-outline-black">Annuler</button>
        <button onClick={onConfirm} className="flex-1 bg-red-500 text-white text-xs tracking-widest uppercase py-3 hover:bg-red-600 transition-colors">
          Supprimer
        </button>
      </div>
    </motion.div>
  </>
);

// ─── Modal Statut Commande ─────────────────────────────────────────────────
const OrderStatusModal = ({ order, onClose, onUpdate }) => {
  const [status, setStatus] = useState(order.orderStatus);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await api.put(`/orders/${order._id}`, { orderStatus: status });
      toast.success('Statut mis à jour !');
      onUpdate(res.data.order);
      onClose();
    } catch {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="fixed inset-0 bg-black/50 z-50" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-2xl p-8 z-50"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm tracking-widest uppercase font-semibold">Modifier le statut</h3>
          <button onClick={onClose}><FiX size={18} className="text-gs-gray hover:text-gs-black" /></button>
        </div>
        <p className="text-xs text-gs-gray font-light mb-4">Commande #{order._id?.slice(-6).toUpperCase()}</p>
        <div className="space-y-2 mb-6">
          {Object.entries(ORDER_STATUS_LABELS).map(([key, label]) => (
            <button key={key} onClick={() => setStatus(key)}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs border transition-all ${status === key ? 'border-gs-black bg-gs-light font-medium' : 'border-black/10 hover:border-black/30'}`}>
              {label}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 btn-outline-black">Annuler</button>
          <button onClick={handleUpdate} disabled={loading} className="flex-1 btn-gold disabled:opacity-60">
            {loading ? 'Chargement...' : 'Confirmer'}
          </button>
        </div>
      </motion.div>
    </>
  );
};

// ─── Page principale ───────────────────────────────────────────────────────
const AdminPage = () => {
  const { logout } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chartPeriod, setChartPeriod] = useState('annee');

  // ── Products state
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ── Orders state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(null);
  const [editOrder, setEditOrder] = useState(null);

  // ── Customers state
  const [customers, setCustomers] = useState([]);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [customersError, setCustomersError] = useState(null);

  const chartData = chartPeriod === 'semaine'
    ? weeklyData.map((d) => ({ month: d.day, revenue: d.ventes * 450, orders: d.ventes }))
    : revenueData;

  // Stats dynamiques
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const outOfStock = products.filter((p) => p.stock === 0).length;
  const stats = [
    {
      label: "Chiffre d'affaires",
      value: totalRevenue > 0 ? `${totalRevenue.toLocaleString('fr-TN')} TND` : '—',
      change: '+12.5%', up: true,
      icon: <FiTrendingUp size={20} />, color: 'bg-gs-gold/10 text-gs-gold'
    },
    {
      label: 'Commandes',
      value: ordersLoading ? '...' : String(orders.length),
      change: '+8.2%', up: true,
      icon: <FiPackage size={20} />, color: 'bg-blue-50 text-blue-500'
    },
    {
      label: 'Clients',
      value: customersLoading ? '...' : String(customers.length),
      change: '+5.1%', up: true,
      icon: <FiUsers size={20} />, color: 'bg-purple-50 text-purple-500'
    },
    {
      label: 'Produits',
      value: productsLoading ? '...' : String(products.length),
      change: `${outOfStock} en rupture`,
      up: outOfStock === 0,
      icon: <FiShoppingBag size={20} />, color: 'bg-green-50 text-green-500'
    },
  ];

  // ── Fetch produits
  const fetchProducts = useCallback(async () => {
    setProductsLoading(true);
    setProductsError(null);
    try {
      const res = await api.get('/products?limit=100');
      setProducts(res.data.products || []);
    } catch {
      setProductsError('Impossible de charger les produits');
    } finally {
      setProductsLoading(false);
    }
  }, []);

  // ── Fetch commandes
  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    setOrdersError(null);
    try {
      const res = await api.get('/orders');
      setOrders(res.data.orders || []);
    } catch {
      setOrdersError('Impossible de charger les commandes');
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  // ── Fetch clients
  const fetchCustomers = useCallback(async () => {
    setCustomersLoading(true);
    setCustomersError(null);
    try {
      const res = await api.get('/users');
      setCustomers(res.data.users || []);
    } catch {
      setCustomersError('Impossible de charger les clients');
    } finally {
      setCustomersLoading(false);
    }
  }, []);

  // Charger tout au mount
  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { fetchOrders(); }, [fetchOrders]);
  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  // ── Supprimer produit
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/products/${deleteTarget._id}`);
      setProducts((prev) => prev.filter((p) => p._id !== deleteTarget._id));
      toast.success('Produit supprimé');
    } catch {
      toast.error('Erreur lors de la suppression');
    } finally {
      setDeleteTarget(null);
    }
  };

  // ── Sauvegarder produit
  const handleSave = (savedProduct) => {
    setProducts((prev) => {
      const exists = prev.find((p) => p._id === savedProduct._id);
      return exists
        ? prev.map((p) => (p._id === savedProduct._id ? savedProduct : p))
        : [savedProduct, ...prev];
    });
  };

  // ── Mettre à jour commande
  const handleOrderUpdate = (updatedOrder) => {
    setOrders((prev) => prev.map((o) => o._id === updatedOrder._id ? updatedOrder : o));
  };

  // ── Formater date
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gs-light flex">

      {/* ── Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 left-0 h-full w-64 bg-gs-black text-white z-40 flex flex-col"
          >
            <div className="px-6 py-6 border-b border-white/10">
              <Link to="/"><div className="font-display text-2xl font-light tracking-widest">Go<span className="font-semibold">Shop</span></div></Link>
              <p className="text-white/30 text-[10px] tracking-widest uppercase mt-1">Admin Panel</p>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-1">
              {navItems.map((item) => (
                <motion.button key={item.id} whileHover={{ x: 4 }} onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${activeSection === item.id ? 'bg-gs-gold text-gs-black font-medium' : 'text-white/50 hover:text-white hover:bg-white/5'}`}>
                  {item.icon}<span className="tracking-wide">{item.label}</span>
                </motion.button>
              ))}
            </nav>
            <div className="px-4 py-4 border-t border-white/10">
              <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-white/40 hover:text-white text-sm transition-colors">
                <FiLogOut size={16} /><span>Déconnexion</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── Main */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>

        {/* Topbar */}
        <div className="bg-white border-b border-black/8 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gs-gray hover:text-gs-black transition-colors">
              {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
            <div>
              <h1 className="text-sm font-semibold tracking-wide capitalize">{activeSection}</h1>
              <p className="text-[10px] text-gs-gray font-light">GoShop Administration</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gs-gold rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">A</span>
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-medium">Admin</p>
              <p className="text-[10px] text-gs-gray font-light">admin@goshop.tn</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">

            {/* ── Dashboard */}
            {activeSection === 'dashboard' && (
              <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {stats.map((stat, i) => (
                    <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }} whileHover={{ y: -4, boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}
                      className="bg-white rounded-2xl p-5 border border-black/5 cursor-default">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>{stat.icon}</div>
                      <p className="text-2xl font-bold mb-1">{stat.value}</p>
                      <p className="text-xs text-gs-gray font-light mb-1">{stat.label}</p>
                      <div className={`flex items-center gap-1 text-xs ${stat.up ? 'text-green-500' : 'text-red-500'}`}>
                        {stat.up ? <FiArrowUp size={10} /> : <FiArrowDown size={10} />}
                        <span>{stat.change}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Chart chiffre d'affaires */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                  className="bg-white rounded-2xl border border-black/5 p-6 mb-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-sm font-semibold tracking-wide">Evolution du Chiffre d'Affaires</h2>
                      <p className="text-xs text-gs-gray font-light mt-0.5">Revenus et commandes</p>
                    </div>
                    <div className="flex gap-2">
                      {['semaine', 'annee'].map((p) => (
                        <button key={p} onClick={() => setChartPeriod(p)}
                          className={`text-[10px] tracking-widest uppercase px-3 py-1.5 transition-all ${chartPeriod === p ? 'bg-gs-black text-white' : 'border border-black/20 text-gs-gray hover:border-gs-black'}`}>
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                      <defs>
                        <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#c9a96e" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#c9a96e" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="ordersGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0a0a0a" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#0a0a0a" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#888' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: '#888' }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '16px' }} />
                      <Area type="monotone" dataKey="revenue" name="Revenue (TND)" stroke="#c9a96e" strokeWidth={2.5} fill="url(#revenueGrad)" dot={false} activeDot={{ r: 5, fill: '#c9a96e' }} />
                      <Area type="monotone" dataKey="orders" name="Commandes" stroke="#0a0a0a" strokeWidth={2} fill="url(#ordersGrad)" dot={false} activeDot={{ r: 5, fill: '#0a0a0a' }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                    className="bg-white rounded-2xl border border-black/5 p-6">
                    <h2 className="text-sm font-semibold tracking-wide mb-1">Ventes Cette Semaine</h2>
                    <p className="text-xs text-gs-gray font-light mb-5">Nombre de commandes par jour</p>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={weeklyData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                        <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#888' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: '#888' }} axisLine={false} tickLine={false} />
                        <Tooltip cursor={{ fill: '#f5f0eb' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '11px' }} />
                        <Bar dataKey="ventes" name="Ventes" radius={[6, 6, 0, 0]}>
                          {weeklyData.map((entry, index) => (
                            <Cell key={index} fill={entry.ventes === Math.max(...weeklyData.map(d => d.ventes)) ? '#0a0a0a' : '#c9a96e'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                    className="bg-white rounded-2xl border border-black/5 p-6">
                    <h2 className="text-sm font-semibold tracking-wide mb-1">Répartition par Catégorie</h2>
                    <p className="text-xs text-gs-gray font-light mb-2">Pourcentage des ventes</p>
                    <div className="flex items-center gap-4">
                      <ResponsiveContainer width="60%" height={180}>
                        <PieChart>
                          <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                            {categoryData.map((entry, index) => (<Cell key={index} fill={entry.color} />))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value}%`, '']} contentStyle={{ borderRadius: '8px', border: 'none', fontSize: '11px' }} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="flex-1 space-y-2">
                        {categoryData.map((cat) => (
                          <div key={cat.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                              <span className="text-xs font-light text-gs-gray">{cat.name}</span>
                            </div>
                            <span className="text-xs font-semibold">{cat.value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Commandes récentes — données réelles */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                  className="bg-white rounded-2xl border border-black/5 p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-sm font-semibold tracking-wide">Commandes Récentes</h2>
                    <button onClick={() => setActiveSection('orders')} className="label-tag hover:text-gs-black transition-colors">Voir tout</button>
                  </div>
                  {ordersLoading ? (
                    <p className="text-xs text-gs-gray text-center py-4">Chargement...</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-black/5">
                            {['Commande', 'Client', 'Date', 'Total', 'Statut'].map((h) => (
                              <th key={h} className="text-left label-tag pb-3 pr-4">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {orders.slice(0, 5).map((order, i) => (
                            <motion.tr key={order._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.08 }}
                              className="border-b border-black/3 hover:bg-gs-light/50 transition-colors">
                              <td className="py-3 pr-4 text-xs font-medium">#{order._id?.slice(-6).toUpperCase()}</td>
                              <td className="py-3 pr-4 text-xs font-light text-gs-gray">
                                {order.user?.name || 'Client supprimé'}
                              </td>
                              <td className="py-3 pr-4 text-xs font-light text-gs-gray">{formatDate(order.createdAt)}</td>
                              <td className="py-3 pr-4 text-xs font-semibold">{order.totalPrice} TND</td>
                              <td className="py-3 pr-4">
                                <span className={`text-[10px] tracking-widest uppercase px-2 py-1 rounded-full ${ORDER_STATUS_COLORS[order.orderStatus] || 'bg-gray-50 text-gray-500'}`}>
                                  {ORDER_STATUS_LABELS[order.orderStatus] || order.orderStatus}
                                </span>
                              </td>
                            </motion.tr>
                          ))}
                          {orders.length === 0 && (
                            <tr><td colSpan={5} className="py-8 text-center text-xs text-gs-gray font-light">Aucune commande</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}

            {/* ── Produits */}
            {activeSection === 'products' && (
              <motion.div key="products" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-3xl font-light italic">
                    Gestion des <span className="font-semibold">Produits</span>
                    {!productsLoading && <span className="text-base font-sans font-light text-gs-gray ml-3">({products.length})</span>}
                  </h2>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => { setEditProduct(null); setShowProductModal(true); }}
                    className="btn-gold flex items-center gap-2">
                    <FiPlus size={14} /> Ajouter
                  </motion.button>
                </div>

                {productsLoading && (
                  <div className="bg-white rounded-2xl border border-black/5 p-12 text-center">
                    <p className="text-xs text-gs-gray font-light">Chargement des produits...</p>
                  </div>
                )}
                {productsError && (
                  <div className="bg-red-50 rounded-2xl p-6 text-center">
                    <p className="text-xs text-red-500">{productsError}</p>
                    <button onClick={fetchProducts} className="mt-3 text-xs underline text-red-500">Réessayer</button>
                  </div>
                )}
                {!productsLoading && !productsError && (
                  <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gs-light">
                          <tr>
                            {['Produit', 'Catégorie', 'Prix', 'Ancien Prix', 'Stock', 'Ventes', 'Statut', 'Actions'].map((h) => (
                              <th key={h} className="text-left label-tag px-6 py-4">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {products.map((product, i) => {
                            const status = product.stock === 0 ? 'rupture' : 'actif';
                            return (
                              <motion.tr key={product._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }} className="border-t border-black/5 hover:bg-gs-light/30 transition-colors">
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gs-beige rounded-lg overflow-hidden flex items-center justify-center">
                                      {product.images?.[0]
                                        ? <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                        : <span>👜</span>}
                                    </div>
                                    <div>
                                      <span className="text-sm font-medium">{product.name}</span>
                                      <div className="flex gap-1 mt-0.5">
                                        {product.isNew && <span className="text-[9px] bg-gs-black text-white px-1.5 py-0.5">NOUVEAU</span>}
                                        {product.isSale && <span className="text-[9px] bg-red-500 text-white px-1.5 py-0.5">SOLDE</span>}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-xs text-gs-gray font-light">{product.category}</td>
                                <td className="px-6 py-4 text-xs font-semibold">{product.price} TND</td>
                                <td className="px-6 py-4 text-xs text-gs-gray line-through font-light">
                                  {product.oldPrice > 0 ? `${product.oldPrice} TND` : '—'}
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`text-xs font-medium ${product.stock === 0 ? 'text-red-500' : product.stock < 6 ? 'text-yellow-600' : 'text-green-600'}`}>
                                    {product.stock}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-xs text-gs-gray font-light">{product.sold || 0}</td>
                                <td className="px-6 py-4">
                                  <span className={`text-[10px] tracking-widest uppercase px-2 py-1 rounded-full ${statusColors[status]}`}>{status}</span>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                    <Link to={`/product/${product._id}`} target="_blank"
                                      className="text-gs-gray hover:text-blue-500 transition-colors">
                                      <FiEye size={14} />
                                    </Link>
                                    <button onClick={() => { setEditProduct(product); setShowProductModal(true); }}
                                      className="text-gs-gray hover:text-gs-gold transition-colors"><FiEdit2 size={14} /></button>
                                    <button onClick={() => setDeleteTarget(product)}
                                      className="text-gs-gray hover:text-red-500 transition-colors"><FiTrash2 size={14} /></button>
                                  </div>
                                </td>
                              </motion.tr>
                            );
                          })}
                          {products.length === 0 && (
                            <tr><td colSpan={8} className="px-6 py-12 text-center text-xs text-gs-gray font-light">Aucun produit trouvé</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── Commandes — données réelles */}
            {activeSection === 'orders' && (
              <motion.div key="orders" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-3xl font-light italic">
                    Gestion des <span className="font-semibold">Commandes</span>
                    {!ordersLoading && <span className="text-base font-sans font-light text-gs-gray ml-3">({orders.length})</span>}
                  </h2>
                  <button onClick={fetchOrders} className="flex items-center gap-2 text-xs text-gs-gray hover:text-gs-black transition-colors border border-black/15 px-3 py-2 rounded-lg">
                    <FiRefreshCw size={13} /> Actualiser
                  </button>
                </div>

                {ordersLoading && (
                  <div className="bg-white rounded-2xl border border-black/5 p-12 text-center">
                    <p className="text-xs text-gs-gray font-light">Chargement des commandes...</p>
                  </div>
                )}
                {ordersError && (
                  <div className="bg-red-50 rounded-2xl p-6 text-center">
                    <p className="text-xs text-red-500">{ordersError}</p>
                    <button onClick={fetchOrders} className="mt-3 text-xs underline text-red-500">Réessayer</button>
                  </div>
                )}
                {!ordersLoading && !ordersError && (
                  <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gs-light">
                          <tr>{['Commande', 'Client', 'Date', 'Articles', 'Total', 'Paiement', 'Statut', 'Actions'].map((h) => (
                            <th key={h} className="text-left label-tag px-6 py-4">{h}</th>
                          ))}</tr>
                        </thead>
                        <tbody>
                          {orders.map((order, i) => (
                            <motion.tr key={order._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }} className="border-t border-black/5 hover:bg-gs-light/30 transition-colors">
                              <td className="px-6 py-4 text-xs font-medium">#{order._id?.slice(-6).toUpperCase()}</td>
                              <td className="px-6 py-4">
                                <p className="text-xs font-medium">{order.user?.name || 'Client supprimé'}</p>
                                <p className="text-[10px] text-gs-gray font-light">{order.user?.email || ''}</p>
                              </td>
                              <td className="px-6 py-4 text-xs font-light text-gs-gray">{formatDate(order.createdAt)}</td>
                              <td className="px-6 py-4 text-xs text-gs-gray font-light">{order.items?.length || 0}</td>
                              <td className="px-6 py-4 text-xs font-semibold">{order.totalPrice} TND</td>
                              <td className="px-6 py-4">
                                <span className={`text-[10px] tracking-widest uppercase px-2 py-1 rounded-full ${
                                  order.paymentStatus === 'paid' ? 'bg-green-50 text-green-600' :
                                  order.paymentStatus === 'failed' ? 'bg-red-50 text-red-500' :
                                  'bg-yellow-50 text-yellow-600'
                                }`}>
                                  {order.paymentStatus === 'paid' ? 'Payé' : order.paymentStatus === 'failed' ? 'Échoué' : 'En attente'}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`text-[10px] tracking-widest uppercase px-2 py-1 rounded-full ${ORDER_STATUS_COLORS[order.orderStatus] || 'bg-gray-50 text-gray-500'}`}>
                                  {ORDER_STATUS_LABELS[order.orderStatus] || order.orderStatus}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <button className="text-gs-gray hover:text-blue-500 transition-colors"><FiEye size={14} /></button>
                                  <button onClick={() => setEditOrder(order)}
                                    className="text-gs-gray hover:text-gs-gold transition-colors"><FiEdit2 size={14} /></button>
                                </div>
                              </td>
                            </motion.tr>
                          ))}
                          {orders.length === 0 && (
                            <tr><td colSpan={8} className="px-6 py-12 text-center text-xs text-gs-gray font-light">Aucune commande</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── Clients — données réelles */}
            {activeSection === 'customers' && (
              <motion.div key="customers" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-3xl font-light italic">
                    Gestion des <span className="font-semibold">Clients</span>
                    {!customersLoading && <span className="text-base font-sans font-light text-gs-gray ml-3">({customers.length})</span>}
                  </h2>
                  <button onClick={fetchCustomers} className="flex items-center gap-2 text-xs text-gs-gray hover:text-gs-black transition-colors border border-black/15 px-3 py-2 rounded-lg">
                    <FiRefreshCw size={13} /> Actualiser
                  </button>
                </div>

                {customersLoading && (
                  <div className="bg-white rounded-2xl border border-black/5 p-12 text-center">
                    <p className="text-xs text-gs-gray font-light">Chargement des clients...</p>
                  </div>
                )}
                {customersError && (
                  <div className="bg-red-50 rounded-2xl p-6 text-center">
                    <p className="text-xs text-red-500">{customersError}</p>
                    <button onClick={fetchCustomers} className="mt-3 text-xs underline text-red-500">Réessayer</button>
                  </div>
                )}
                {!customersLoading && !customersError && (
                  <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gs-light">
                          <tr>{['Client', 'Email', 'Téléphone', 'Inscription', 'Adresses'].map((h) => (
                            <th key={h} className="text-left label-tag px-6 py-4">{h}</th>
                          ))}</tr>
                        </thead>
                        <tbody>
                          {customers.map((customer, i) => (
                            <motion.tr key={customer._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }} className="border-t border-black/5 hover:bg-gs-light/30 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-gs-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-xs font-semibold text-gs-gold">
                                      {customer.name?.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                  <span className="text-sm font-medium">{customer.name}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2 text-xs text-gs-gray font-light">
                                  <FiMail size={11} />
                                  {customer.email}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2 text-xs text-gs-gray font-light">
                                  <FiPhone size={11} />
                                  {customer.phone || '—'}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2 text-xs text-gs-gray font-light">
                                  <FiCalendar size={11} />
                                  {formatDate(customer.createdAt)}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-xs text-gs-gray font-light">
                                {customer.addresses?.length || 0} adresse{customer.addresses?.length !== 1 ? 's' : ''}
                              </td>
                            </motion.tr>
                          ))}
                          {customers.length === 0 && (
                            <tr><td colSpan={5} className="px-6 py-12 text-center text-xs text-gs-gray font-light">Aucun client inscrit</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── Paramètres */}
            {activeSection === 'settings' && (
              <motion.div key="settings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h2 className="font-display text-3xl font-light italic mb-6"><span className="font-semibold">Paramètres</span></h2>
                <div className="bg-white rounded-2xl border border-black/5 p-8 space-y-6 max-w-lg">
                  {[
                    { label: 'Nom de la boutique', value: 'GoShop Maroquinerie' },
                    { label: 'Email de contact', value: 'contact@goshop.tn' },
                    { label: 'Devise', value: 'TND' },
                    { label: 'Livraison gratuite dès', value: '200 TND' },
                  ].map((setting) => (
                    <div key={setting.label}>
                      <label className="label-tag mb-2 block">{setting.label}</label>
                      <input type="text" defaultValue={setting.value}
                        className="w-full border border-black/20 px-4 py-3 text-sm outline-none focus:border-gs-black transition-colors font-light" />
                    </div>
                  ))}
                  <button className="btn-gold">Sauvegarder</button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* ── Modals */}
      <AnimatePresence>
        {showProductModal && (
          <ProductModal
            product={editProduct}
            onClose={() => { setShowProductModal(false); setEditProduct(null); }}
            onSave={handleSave}
          />
        )}
        {deleteTarget && (
          <DeleteModal
            product={deleteTarget}
            onClose={() => setDeleteTarget(null)}
            onConfirm={handleDelete}
          />
        )}
        {editOrder && (
          <OrderStatusModal
            order={editOrder}
            onClose={() => setEditOrder(null)}
            onUpdate={handleOrderUpdate}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPage;