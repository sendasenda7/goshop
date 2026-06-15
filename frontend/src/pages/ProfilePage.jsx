import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiUser, FiPackage, FiHeart, FiMapPin,
  FiSettings, FiLogOut, FiEdit2, FiCheck,
  FiArrowRight, FiCamera
} from 'react-icons/fi';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const mockUser = {
  name: 'Sarah Ben Ali',
  email: 'sarah@email.com',
  phone: '+216 22 333 444',
  avatar: '',
  joinDate: 'Janvier 2024',
};

const mockOrders = [
  { _id: 'GS001', date: '30/05/2026', total: 830, status: 'livre', items: [{ name: 'The Dome', emoji: '👜' }, { name: 'Neon Noir', emoji: '👝' }] },
  { _id: 'GS002', date: '15/04/2026', total: 450, status: 'livre', items: [{ name: 'Monolith', emoji: '💼' }] },
  { _id: 'GS003', date: '02/03/2026', total: 290, status: 'livre', items: [{ name: 'The Classic', emoji: '👛' }] },
];

const mockWishlist = [
  { _id: '1', name: 'The Dome', price: 380, category: 'Femme', emoji: '👜' },
  { _id: '2', name: 'SS26 Tote', price: 420, category: 'Collections', emoji: '🎒' },
  { _id: '7', name: 'Mini Luxe', price: 190, category: 'Cadeaux', emoji: '👛' },
];

const mockAddresses = [
  { _id: 'a1', fullName: 'Sarah Ben Ali', street: '12 Rue de la Republique', city: 'Tunis', zipCode: '1001', country: 'Tunisie', isDefault: true },
  { _id: 'a2', fullName: 'Sarah Ben Ali', street: '5 Avenue Habib Bourguiba', city: 'Sousse', zipCode: '4000', country: 'Tunisie', isDefault: false },
];

const tabs = [
  { id: 'profile', label: 'Mon Profil', icon: <FiUser size={16} /> },
  { id: 'orders', label: 'Mes Commandes', icon: <FiPackage size={16} /> },
  { id: 'wishlist', label: 'Wishlist', icon: <FiHeart size={16} /> },
  { id: 'addresses', label: 'Mes Adresses', icon: <FiMapPin size={16} /> },
  { id: 'settings', label: 'Parametres', icon: <FiSettings size={16} /> },
];

const statusColors = {
  livre: 'bg-green-50 text-green-600',
  expedition: 'bg-blue-50 text-blue-500',
  traitement: 'bg-yellow-50 text-yellow-600',
  annule: 'bg-red-50 text-red-500',
};

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [editing, setEditing] = useState(false);
  const [userData, setUserData] = useState(mockUser);
  const [wishlist, setWishlist] = useState(mockWishlist);

  const handleSave = () => {
    setEditing(false);
    alert('Profil mis a jour !');
  };

  const removeFromWishlist = (id) => {
    setWishlist(wishlist.filter(item => item._id !== id));
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
                <p className="text-[10px] text-gs-gold font-light mt-1 tracking-wide">
                  Membre depuis {userData.joinDate}
                </p>
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
                <Link to="/login">
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 text-xs text-red-400 hover:text-red-600 transition-colors">
                    <FiLogOut size={16} />
                    <span>Deconnexion</span>
                  </button>
                </Link>
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
                      className={`flex items-center gap-2 text-xs tracking-widest uppercase px-4 py-2 transition-all ${
                        editing ? 'bg-gs-gold text-gs-black' : 'border border-black/20 text-gs-gray hover:border-gs-black hover:text-gs-black'
                      }`}
                    >
                      {editing ? <FiCheck size={12} /> : <FiEdit2 size={12} />}
                      {editing ? 'Sauvegarder' : 'Modifier'}
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
                      { label: 'Commandes', value: mockOrders.length },
                      { label: 'Wishlist', value: wishlist.length },
                      { label: 'Adresses', value: mockAddresses.length },
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
                    Mes Commandes ({mockOrders.length})
                  </h2>

                  {mockOrders.map((order, i) => (
                    <motion.div
                      key={order._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white rounded-2xl p-6 border border-black/5"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="text-sm font-semibold">#{order._id}</p>
                          <p className="text-xs text-gs-gray font-light mt-0.5">{order.date}</p>
                        </div>
                        <div className="text-right">
                          <span className={`text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full ${statusColors[order.status]}`}>
                            {order.status}
                          </span>
                          <p className="text-sm font-semibold mt-2">{order.total} TND</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mb-4">
                        {order.items.map((item, j) => (
                          <div key={j} className="flex items-center gap-2 bg-gs-light rounded-xl px-3 py-2">
                            <span className="text-lg">{item.emoji}</span>
                            <span className="text-xs font-light">{item.name}</span>
                          </div>
                        ))}
                      </div>

                      <button className="flex items-center gap-2 label-tag hover:text-gs-black transition-colors">
                        Voir le detail
                        <FiArrowRight size={12} />
                      </button>
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
                      {wishlist.map((item, i) => (
                        <motion.div
                          key={item._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ delay: i * 0.1 }}
                          className="bg-white rounded-2xl p-5 border border-black/5 group"
                        >
                          <div className="relative bg-gs-beige rounded-xl aspect-square flex items-center justify-center mb-3">
                            <span className="text-5xl">{item.emoji}</span>
                            <button
                              onClick={() => removeFromWishlist(item._id)}
                              className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <FiHeart size={12} className="text-red-400 fill-red-400" />
                            </button>
                          </div>
                          <h3 className="text-sm font-medium mb-0.5">{item.name}</h3>
                          <p className="text-xs text-gs-gray font-light mb-2">{item.category}</p>
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold">{item.price} TND</p>
                            <Link to={`/product/${item._id}`}>
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
                    <button className="flex items-center gap-2 text-xs tracking-widest uppercase border border-black/20 px-4 py-2 hover:bg-gs-black hover:text-white transition-all">
                      + Ajouter
                    </button>
                  </div>

                  <div className="space-y-4">
                    {mockAddresses.map((address, i) => (
                      <motion.div
                        key={address._id}
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
                          <button className="text-gs-gray hover:text-gs-gold transition-colors">
                            <FiEdit2 size={14} />
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
                        {['Mot de passe actuel', 'Nouveau mot de passe', 'Confirmer'].map((label) => (
                          <div key={label}>
                            <label className="label-tag mb-2 block">{label}</label>
                            <input
                              type="password"
                              placeholder="••••••••"
                              className="w-full border border-black/20 px-4 py-3 text-sm outline-none focus:border-gs-black transition-colors font-light"
                            />
                          </div>
                        ))}
                        <button className="btn-gold mt-2">Modifier</button>
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
                      <button className="text-xs tracking-widest uppercase border border-red-200 text-red-400 px-4 py-2 hover:bg-red-50 transition-colors">
                        Supprimer mon compte
                      </button>
                    </div>
                  </div>
                </motion.div>
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