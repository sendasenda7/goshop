import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiArrowLeft, FiArrowRight, FiShoppingBag, FiTag, FiX } from 'react-icons/fi';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const CartPage = () => {
  const {
    cart,
    total,
    removeFromCart,
    updateQuantity,
    couponCode,
    discountAmount,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const items = cart;
  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const navigate = useNavigate();

  const removeItem = async (id) => {
    try {
      await removeFromCart(id);
    } catch (err) {
      console.error(err);
      toast.error("Impossible de retirer cet article");
    }
  };

  const handleUpdateQuantity = async (id, qty) => {
    if (qty < 1) return;
    try {
      await updateQuantity(id, qty);
    } catch (err) {
      const message = err.response?.data?.message || 'Impossible de mettre à jour la quantité';
      toast.error(message);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    try {
      await applyCoupon(couponInput.trim());
      toast.success('Code promo applique !');
    } catch (err) {
      const message = err.response?.data?.message || 'Code promo invalide';
      toast.error(message);
    } finally {
      setCouponLoading(false);
    }
  };

  const subtotal = total;
  const discount = discountAmount;
  const shipping = subtotal >= 200 ? 0 : 15;
  const orderTotal = subtotal - discount + shipping;

  return (
    <div className="min-h-screen bg-gs-white">
      <Navbar />
      <div className="pt-28 pb-16 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <Link to="/shop" className="flex items-center gap-2 label-tag hover:text-gs-black transition-colors mb-4">
            <FiArrowLeft size={14} />
            Continuer les achats
          </Link>
          <h1 className="font-display text-5xl font-light italic">
            Mon <span className="font-semibold">Panier</span>
          </h1>
          <p className="text-gs-gray text-sm font-light mt-1">
            {items.length} article{items.length > 1 ? 's' : ''}
          </p>
        </motion.div>

        {items.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-24">
            <div className="text-8xl mb-6">🛍️</div>
            <h2 className="font-display text-4xl font-light italic mb-4">Votre panier est vide</h2>
            <p className="text-gs-gray text-sm font-light mb-8">Decouvrez nos collections et trouvez votre piece ideale</p>
            <Link to="/shop">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-gold inline-flex items-center gap-2">
                <FiShoppingBag size={14} />
                Decouvrir la Boutique
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {items.map((item, i) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-5 p-5 border border-black/8 rounded-xl hover:border-black/20 transition-colors"
                  >
                    <Link to={`/product/${item.product?._id}`}>
                      <div className="w-24 h-24 bg-gs-beige rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {item.product?.images?.[0] ? (
                          <img src={item.product.images[0]} alt={item.product?.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-4xl">👜</span>
                        )}
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link to={`/product/${item.product?._id}`}>
                            <h3 className="text-sm font-medium tracking-wide hover:text-gs-gold transition-colors">{item.product?.name}</h3>
                          </Link>
                          <p className="text-xs text-gs-gray font-light mt-0.5">{item.product?.category}</p>
                        </div>
                        <button onClick={() => removeItem(item._id)} className="text-gs-gray hover:text-red-500 transition-colors">
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        {item.size && <span className="text-[10px] tracking-widest uppercase border border-black/15 px-2 py-1 text-gs-gray">{item.size}</span>}
                        {item.color && <span className="text-[10px] tracking-widest uppercase text-gs-gray font-light capitalize">{item.color}</span>}
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-black/15">
                          <button onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gs-light transition-colors text-sm">-</button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gs-light transition-colors text-sm">+</button>
                        </div>
                        <p className="text-sm font-semibold">{((item.product?.price || 0) * item.quantity).toFixed(0)} TND</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <div className="border border-black/8 rounded-xl p-6 sticky top-28">
                <h2 className="text-sm tracking-widest uppercase font-semibold mb-6">Recapitulatif</h2>
                <div className="mb-6">
                  <label className="label-tag mb-2 block">Code promo</label>
                  {couponCode ? (
                    <div className="flex items-center justify-between border border-green-200 bg-green-50 px-3 py-2.5 rounded">
                      <span className="text-xs text-green-700 font-medium tracking-wide">{couponCode} applique</span>
                      <button onClick={removeCoupon} aria-label="Retirer le code promo">
                        <FiX size={14} className="text-green-700 hover:text-red-500 transition-colors" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <div className="flex items-center flex-1 border border-black/20 focus-within:border-gs-black transition-colors">
                        <FiTag size={12} className="ml-3 text-gs-gray" />
                        <input
                          type="text"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                          placeholder="Code promo"
                          className="flex-1 px-2 py-2.5 text-xs outline-none bg-transparent placeholder:text-gs-gray font-light"
                        />
                      </div>
                      <button
                        onClick={handleApplyCoupon}
                        disabled={couponLoading}
                        className="bg-gs-black text-white text-xs tracking-widest uppercase px-4 hover:bg-gs-gold transition-colors disabled:opacity-50"
                      >
                        {couponLoading ? '...' : 'OK'}
                      </button>
                    </div>
                  )}
                </div>
                <div className="space-y-3 mb-6 pb-6 border-b border-black/8">
                  <div className="flex justify-between text-sm">
                    <span className="text-gs-gray font-light">Sous-total</span>
                    <span className="font-medium">{subtotal} TND</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600 font-light">Reduction</span>
                      <span className="text-green-600 font-medium">-{discount} TND</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gs-gray font-light">Livraison</span>
                    <span className={shipping === 0 ? 'text-green-600 font-medium' : 'font-medium'}>
                      {shipping === 0 ? 'Gratuite' : `${shipping} TND`}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm tracking-widest uppercase font-semibold">Total</span>
                  <span className="font-display text-2xl font-semibold">{orderTotal} TND</span>
                </div>
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={() => navigate('/checkout')} className="w-full btn-gold flex items-center justify-center gap-2 mb-3">
                  Commander
                  <FiArrowRight size={14} />
                </motion.button>
                <Link to="/shop">
                  <button className="w-full btn-outline-black text-center">Continuer les achats</button>
                </Link>
                <p className="text-center text-[10px] text-gs-gray font-light mt-4 tracking-wide">Paiement 100% securise</p>
              </div>
            </motion.div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;