import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiUser, FiPackage, FiHeart, FiMapPin,
  FiSettings, FiLogOut, FiEdit2, FiCheck,
  FiCamera
} from 'react-icons/fi';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const tabs = [
  { id: 'profile', label: 'Mon Profil', icon: <FiUser size={16} /> },
  { id: 'orders', label: 'Mes Commandes', icon: <FiPackage size={16} /> },
  { id: 'wishlist', label: 'Wishlist', icon: <FiHeart size={16} /> },
  { id: 'addresses', label: 'Mes Adresses', icon: <FiMapPin size={16} /> },
  { id: 'settings', label: 'Parametres', icon: <FiSettings size={16} /> },
];

const statusColors = {
  processing: 'bg-yellow-50 text-yellow-600',
  shipped: 'bg-blue-50 text-blue-500',
  delivered: 'bg-green-50 text-green-600',
  cancelled: 'bg-red-50 text-red-500',
};

const statusLabels = {
  processing: 'En traitement',
  shipped: 'Expedition',
  delivered: 'Livre',
  cancelled: 'Annule',
};

const SettingsTab = ({ onDeleteAccount }) => {
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [pwLoading, setPwLoading] = useState(false);

  const handlePasswordChange = async () => {
    if (!passwords.current || !passwords.next || !passwords.confirm) {
      toast.error('Tous les champs sont requis'); return;
    }
    if (passwords.next !== passwords.confirm) {
      toast.error('Les mots de passe ne correspondent pas'); return;
    }
    if (passwords.next.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères'); return;
    }
    setPwLoading(true);
    try {
      await api.put('/users/profile', {
        password: passwords.next,
        currentPassword: passwords.current,
      });
      setPasswords({ current: '', next: '', confirm: '' });
      toast.success('Mot de passe mis a jour !');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors du changement');
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <motion.div
      key="settings"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="bg-white rounded-2xl p-8 border border-black/5"
    >
      <h2 className="text-sm font-semibold tracking-widest uppercase mb-6">Parametres du Compte</h2>
      <div className="space-y-6">

        {/* Password */}
        <div>
          <h3 className="text-xs font-semibold tracking-wide mb-4 pb-2 border-b border-black/5">
            Changer le mot de passe
          </h3>
          <div className="space-y-3 max-w-md">
            {[
              { label: 'Mot de passe actuel', key: 'current' },
              { label: 'Nouveau mot de passe', key: 'next' },
              { label: 'Confirmer', key: 'confirm' },
            ].map((field) => (
              <div key={field.key}>
                <label className="label-tag mb-2 block">{field.label}</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={passwords[field.key]}
                  onChange={(e) => setPasswords({ ...passwords, [field.key]: e.target.value })}
                  className="w-full border border-black/20 px-4 py-3 text-sm outline-none focus:border-gs-black transition-colors font-light"
                />
              </div>
            ))}
            <button
              onClick={handlePasswordChange}
              disabled={pwLoading}
              className="btn-gold mt-2 disabled:opacity-60"
            >
              {pwLoading ? 'Modification...' : 'Modifier'}
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div>
          <h3 className="text-xs font-semibold tracking-wide mb-4 pb-2 border-b border-black/5">
            Notifications
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Confirmation de commande', default: true },
              { label: 'Offres et promotions', default: false },
              { label: 'Nouveautes et drops', default: true },
            ].map((notif) => (
              <div key={notif.label} className="flex items-center justify-between">
                <span className="text-sm font-light">{notif.label}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={notif.default} className="sr-only peer" />
                  <div className="w-10 h-5 bg-black/10 rounded-full peer peer-checked:bg-gs-black transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div>
          <h3 className="text-xs font-semibold tracking-wide text-red-400 mb-4 pb-2 border-b border-red-100">
            Zone Dangereuse
          </h3>
          <button
              onClick={onDeleteAccount}
              className="text-xs tracking-widest uppercase border border-red-200 text-red-400 px-4 py-2 hover:bg-red-50 transition-colors">
            Supprimer mon compte
          </button>
        </div>

      </div>
    </motion.div>
  );
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { wishlist, removeFromWishlist } = useWishlist();

  const [activeTab, setActiveTab] = useState('profile');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState({ name: '', email: '', phone: '' });
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ fullName: '', street: '', city: '', zipCode: '', country: 'Tunisie', isDefault: false });
  const [addressSaving, setAddressSaving] = useState(false);

  // Redirection si non connecté
  useEffect(() => {
    if (!user && !localStorage.getItem('token')) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
      setAddresses(user.addresses || []);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return; // Ne pas fetcher si non connecté
    const fetchOrders = async () => {
      try {
        const res = await api.get('/users/orders');
        setOrders(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const handleAddAddress = async () => {
    if (!newAddress.fullName || !newAddress.street || !newAddress.city || !newAddress.zipCode) {
      toast.error('Veuillez remplir tous les champs obligatoires'); return;
    }
    setAddressSaving(true);
    try {
      const updatedAddresses = [...addresses, newAddress];
      const res = await api.put('/users/profile', { addresses: updatedAddresses });
      setAddresses(res.data.addresses || []);
      setNewAddress({ fullName: '', street: '', city: '', zipCode: '', country: 'Tunisie', isDefault: false });
      setShowAddressForm(false);
      toast.success('Adresse ajoutée !');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'ajout');
    } finally {
      setAddressSaving(false);
    }
  };

  const handleDeleteAddress = async (index) => {
    try {
      const updatedAddresses = addresses.filter((_, i) => i !== index);
      const res = await api.put('/users/profile', { addresses: updatedAddresses });
      setAddresses(res.data.addresses || []);
      toast.success('Adresse supprimée');
    } catch (err) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) return;
    try {
      await api.delete('/users/profile');
      logout();
      navigate('/');
      toast.success('Compte supprimé');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la suppression du compte');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put('/users/profile', {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
      });
      setUserData({ name: res.data.name, email: res.data.email, phone: res.data.phone || '' });
      setEditing(false);
      toast.success('Profil mis a jour !');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la mise a jour');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gs-light">
      <Navbar />

      <div className="pt-24 pb-16 px-6 md:px-12 max-w-6xl mx-auto">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <p className="label-tag text-gs-gold mb-2">Mon Espace</p>
          <h1 className="font-display text-5xl font-light italic">
            Mon <span className="font-semibold">Compte</span>
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* SIDEBAR */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl p-6 border border-black/5">

              {/* Avatar */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-20 h-20 bg-gs-beige rounded-full flex items-center justify-center mx-auto mb-3">
                    <FiUser size={32} className="text-gs-gray" />
                  </div>
                  <button className="absolute bottom-3 right-0 w-7 h-7 bg-gs-black text-white rounded-full flex items-center justify-center hover:bg-gs-gold transition-colors">
                    <FiCamera size={12} />
                  </button>
                </div>
                <h3 className="font-medium text-sm">{userData.name}</h3>
                <p className="text-xs text-gs-gray font-light">{userData.email}</p>
                {user?.createdAt && (
                  <p className="text-[10px] text-gs-gold font-light mt-1 tracking-wide">
                    Membre depuis {new Date(user.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                  </p>
                )}
              </div>

              {/* Nav */}
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ x: 3 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-all ${
                      activeTab === tab.id
                        ? 'bg-gs-black text-white font-medium'
                        : 'text-gs-gray hover:text-gs-black hover:bg-gs-light'
                    }`}
                  >
                    {tab.icon}
                    <span className="tracking-wide">{tab.label}</span>
                  </motion.button>
                ))}
              </nav>

              {/* Logout */}
              <div className="mt-4 pt-4 border-t border-black/5">
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 text-xs text-red-400 hover:text-red-600 transition-colors">
                  <FiLogOut size={16} />
                  <span>Deconnexion</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* MAIN CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <AnimatePresence mode="wait">

              {/* PROFILE */}
              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-2xl p-8 border border-black/5"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-sm font-semibold tracking-widest uppercase">Informations Personnelles</h2>
                    <button
                      onClick={() => editing ? handleSave() : setEditing(true)}
                      disabled={saving}
                      className={`flex items-center gap-2 text-xs tracking-widest uppercase px-4 py-2 transition-all disabled:opacity-60 ${
                        editing ? 'bg-gs-gold text-gs-black' : 'border border-black/20 text-gs-gray hover:border-gs-black hover:text-gs-black'
                      }`}
                    >
                      {editing ? <FiCheck size={12} /> : <FiEdit2 size={12} />}
                      {saving ? 'Sauvegarde...' : editing ? 'Sauvegarder' : 'Modifier'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { label: 'Nom complet', key: 'name', type: 'text' },
                      { label: 'Email', key: 'email', type: 'email' },
                      { label: 'Telephone', key: 'phone', type: 'tel' },
                    ].map((field) => (
                      <div key={field.key} className={field.key === 'phone' ? 'md:col-span-2' : ''}>
                        <label className="label-tag mb-2 block">{field.label}</label>
                        {editing ? (
                          <input
                            type={field.type}
                            value={userData[field.key]}
                            onChange={(e) => setUserData({ ...userData, [field.key]: e.target.value })}
                            className="w-full border border-black/20 px-4 py-3 text-sm outline-none focus:border-gs-black transition-colors font-light"
                          />
                        ) : (
                          <p className="text-sm font-light py-3 border-b border-black/5">
                            {userData[field.key] || '-'}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-black/5">
                    {[
                      { label: 'Commandes', value: orders.length },
                      { label: 'Wishlist', value: wishlist.length },
                      { label: 'Adresses', value: addresses.length },
                    ].map((stat) => (
                      <div key={stat.label} className="text-center">
                        <p className="font-display text-3xl font-semibold">{stat.value}</p>
                        <p className="text-xs text-gs-gray font-light mt-1">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ORDERS */}
              {activeTab === 'orders' && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <h2 className="text-sm font-semibold tracking-widest uppercase mb-4">
                    Mes Commandes ({orders.length})
                  </h2>

                  {ordersLoading ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-black/5">
                      <p className="text-sm text-gs-gray font-light">Chargement...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-black/5">
                      <div className="text-6xl mb-4">📦</div>
                      <p className="font-display text-2xl font-light italic text-gs-gray mb-4">
                        Vous n'avez pas encore de commande
                      </p>
                      <Link to="/shop">
                        <button className="btn-gold">Decouvrir la boutique</button>
                      </Link>
                    </div>
                  ) : orders.map((order, i) => (
                    <motion.div
                      key={order._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white rounded-2xl p-6 border border-black/5"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-sm font-semibold">#{order._id.slice(-8).toUpperCase()}</p>
                          <p className="text-xs text-gs-gray font-light mt-0.5">
                            {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full ${statusColors[order.orderStatus] || ''}`}>
                            {statusLabels[order.orderStatus] || order.orderStatus}
                          </span>
                          <p className="text-sm font-semibold mt-2">{order.totalPrice} TND</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mb-4 flex-wrap">
                        {order.items.map((item, j) => (
                          <div key={j} className="flex items-center gap-2 bg-gs-light rounded-xl px-3 py-2">
                            <span className="text-xs font-light">{item.quantity}x {item.name}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* WISHLIST */}
              {activeTab === 'wishlist' && (
                <motion.div
                  key="wishlist"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <h2 className="text-sm font-semibold tracking-widest uppercase mb-4">
                    Ma Wishlist ({wishlist.length})
                  </h2>

                  {wishlist.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-black/5">
                      <div className="text-6xl mb-4">🤍</div>
                      <p className="font-display text-2xl font-light italic text-gs-gray mb-4">
                        Votre wishlist est vide
                      </p>
                      <Link to="/shop">
                        <button className="btn-gold">Decouvrir la boutique</button>
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {wishlist.filter(item => item.product).map((item, i) => (
                        <motion.div
                          key={item._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ delay: i * 0.1 }}
                          className="bg-white rounded-2xl p-5 border border-black/5 group"
                        >
                          <div className="relative bg-gs-beige rounded-xl aspect-square flex items-center justify-center mb-3 overflow-hidden">
                            {item.product.images?.[0] ? (
                              <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-5xl">👜</span>
                            )}
                            <button
                              onClick={() => removeFromWishlist(item.product._id)}
                              className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <FiHeart size={12} className="text-red-400 fill-red-400" />
                            </button>
                          </div>
                          <h3 className="text-sm font-medium mb-0.5">{item.product.name}</h3>
                          <p className="text-xs text-gs-gray font-light mb-2">{item.product.category}</p>
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold">{item.product.price} TND</p>
                            <Link to={`/product/${item.product._id}`}>
                              <button className="text-[10px] tracking-widest uppercase border border-black/20 px-3 py-1.5 hover:bg-gs-black hover:text-white transition-all">
                                Voir
                              </button>
                            </Link>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ADDRESSES */}
              {activeTab === 'addresses' && (
                <motion.div
                  key="addresses"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold tracking-widest uppercase">
                      Mes Adresses
                    </h2>
                    <button
                      onClick={() => setShowAddressForm(!showAddressForm)}
                      className="flex items-center gap-2 text-xs tracking-widest uppercase border border-black/20 px-4 py-2 hover:bg-gs-black hover:text-white transition-all"
                    >
                      {showAddressForm ? '✕ Annuler' : '+ Ajouter'}
                    </button>
                  </div>

                  {/* Formulaire ajout adresse */}
                  {showAddressForm && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl p-6 border border-gs-gold mb-4 space-y-3"
                    >
                      <h3 className="text-xs font-semibold tracking-widest uppercase mb-2">Nouvelle adresse</h3>
                      {[
                        { label: 'Nom complet *', key: 'fullName', placeholder: 'Prénom Nom' },
                        { label: 'Rue *', key: 'street', placeholder: '12 Rue de la République' },
                        { label: 'Ville *', key: 'city', placeholder: 'Tunis' },
                        { label: 'Code postal *', key: 'zipCode', placeholder: '1001' },
                        { label: 'Pays', key: 'country', placeholder: 'Tunisie' },
                      ].map((field) => (
                        <div key={field.key}>
                          <label className="label-tag mb-1 block">{field.label}</label>
                          <input
                            type="text"
                            placeholder={field.placeholder}
                            value={newAddress[field.key]}
                            onChange={(e) => setNewAddress({ ...newAddress, [field.key]: e.target.value })}
                            className="w-full border border-black/20 px-4 py-2.5 text-sm outline-none focus:border-gs-black transition-colors font-light"
                          />
                        </div>
                      ))}
                      <label className="flex items-center gap-2 text-sm font-light cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newAddress.isDefault}
                          onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                          className="accent-gs-gold"
                        />
                        Définir comme adresse principale
                      </label>
                      <button
                        onClick={handleAddAddress}
                        disabled={addressSaving}
                        className="btn-gold mt-2 disabled:opacity-60"
                      >
                        {addressSaving ? 'Enregistrement...' : 'Enregistrer'}
                      </button>
                    </motion.div>
                  )}

                  <div className="space-y-4">
                    {addresses.length === 0 ? (
                      <div className="bg-white rounded-2xl p-12 text-center border border-black/5">
                        <p className="font-display text-2xl font-light italic text-gs-gray">
                          Aucune adresse enregistree
                        </p>
                      </div>
                    ) : addresses.map((address, i) => (
                      <motion.div
                        key={address._id || i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`bg-white rounded-2xl p-6 border-2 transition-colors ${
                          address.isDefault ? 'border-gs-gold' : 'border-black/5'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3 mb-3">
                            <FiMapPin size={16} className={address.isDefault ? 'text-gs-gold' : 'text-gs-gray'} />
                            <div>
                              {address.isDefault && (
                                <span className="text-[10px] tracking-widest uppercase text-gs-gold font-medium">
                                  Adresse principale
                                </span>
                              )}
                              <p className="text-sm font-medium">{address.fullName}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteAddress(i)}
                            className="text-gs-gray hover:text-red-400 transition-colors text-xs tracking-widest uppercase"
                          >
                            Supprimer
                          </button>
                        </div>
                        <p className="text-sm font-light text-gs-gray">{address.street}</p>
                        <p className="text-sm font-light text-gs-gray">
                          {address.zipCode} {address.city}, {address.country}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* SETTINGS */}
              {activeTab === 'settings' && (
                <SettingsTab onDeleteAccount={handleDeleteAccount} />
              )}

            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProfilePage;