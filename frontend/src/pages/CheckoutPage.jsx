import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiArrowRight, FiCheck, FiCreditCard, FiMapPin, FiPackage } from 'react-icons/fi';
import Navbar from '../components/layout/Navbar';
import { useCart } from '../context/CartContext';

const steps = ['Livraison', 'Paiement', 'Confirmation'];



const CheckoutPage = () => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const [shipping, setShipping] = useState({
    fullName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Tunisie',
    phone: '',
  });

  const [payment, setPayment] = useState({
    method: 'card',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });
const { cart, total: subtotal, clearCart } = useCart();
  const shippingCost = subtotal >= 200 ? 0 : 15;
  const total = subtotal + shippingCost;

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      // Vide le panier local après confirmation
      clearCart();
      window.scrollTo({ top: 0, behavior: 'smooth' });

    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gs-light">
      <Navbar />

      <div className="pt-24 pb-16 px-6 md:px-12 max-w-6xl mx-auto">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <Link to="/cart" className="flex items-center gap-2 label-tag hover:text-gs-black transition-colors mb-4">
            <FiArrowLeft size={14} />
            Retour au panier
          </Link>
          <h1 className="font-display text-5xl font-light italic">
            Finaliser la <span className="font-semibold">Commande</span>
          </h1>
        </motion.div>

        {/* STEPS INDICATOR */}
        <div className="flex items-center gap-0 mb-10">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{
                    backgroundColor: i <= step ? '#0a0a0a' : '#ffffff',
                    borderColor: i <= step ? '#0a0a0a' : '#e5e7eb',
                  }}
                  className="w-8 h-8 rounded-full border-2 flex items-center justify-center"
                >
                  {i < step ? (
                    <FiCheck size={14} className="text-white" />
                  ) : (
                    <span className={`text-xs font-medium ${i <= step ? 'text-white' : 'text-gs-gray'}`}>
                      {i + 1}
                    </span>
                  )}
                </motion.div>
                <span className={`text-xs tracking-widest uppercase hidden md:block ${i <= step ? 'text-gs-black font-medium' : 'text-gs-gray font-light'}`}>
                  {s}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-16 md:w-24 h-px mx-3 transition-colors ${i < step ? 'bg-gs-black' : 'bg-black/15'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* MAIN FORM */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">

              {/* STEP 1 — SHIPPING */}
              {step === 0 && (
                <motion.form
                  key="shipping"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleShippingSubmit}
                  className="bg-white rounded-2xl p-8"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <FiMapPin size={18} className="text-gs-gold" />
                    <h2 className="text-sm tracking-widest uppercase font-semibold">Adresse de Livraison</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="label-tag mb-2 block">Nom complet</label>
                      <input
                        type="text"
                        value={shipping.fullName}
                        onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                        placeholder="Votre nom complet"
                        required
                        className="w-full border border-black/20 px-4 py-3 text-sm outline-none focus:border-gs-black transition-colors font-light placeholder:text-gs-gray"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="label-tag mb-2 block">Adresse</label>
                      <input
                        type="text"
                        value={shipping.street}
                        onChange={(e) => setShipping({ ...shipping, street: e.target.value })}
                        placeholder="Rue, numero"
                        required
                        className="w-full border border-black/20 px-4 py-3 text-sm outline-none focus:border-gs-black transition-colors font-light placeholder:text-gs-gray"
                      />
                    </div>

                    <div>
                      <label className="label-tag mb-2 block">Ville</label>
                      <input
                        type="text"
                        value={shipping.city}
                        onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                        placeholder="Tunis"
                        required
                        className="w-full border border-black/20 px-4 py-3 text-sm outline-none focus:border-gs-black transition-colors font-light placeholder:text-gs-gray"
                      />
                    </div>

                    <div>
                      <label className="label-tag mb-2 block">Code postal</label>
                      <input
                        type="text"
                        value={shipping.zipCode}
                        onChange={(e) => setShipping({ ...shipping, zipCode: e.target.value })}
                        placeholder="1000"
                        required
                        className="w-full border border-black/20 px-4 py-3 text-sm outline-none focus:border-gs-black transition-colors font-light placeholder:text-gs-gray"
                      />
                    </div>

                    <div>
                      <label className="label-tag mb-2 block">Gouvernorat</label>
                      <input
                        type="text"
                        value={shipping.state}
                        onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                        placeholder="Tunis"
                        required
                        className="w-full border border-black/20 px-4 py-3 text-sm outline-none focus:border-gs-black transition-colors font-light placeholder:text-gs-gray"
                      />
                    </div>

                    <div>
                      <label className="label-tag mb-2 block">Pays</label>
                      <select
                        value={shipping.country}
                        onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
                        className="w-full border border-black/20 px-4 py-3 text-sm outline-none focus:border-gs-black transition-colors font-light bg-white"
                      >
                        <option>Tunisie</option>
                        <option>France</option>
                        <option>Algerie</option>
                        <option>Maroc</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="label-tag mb-2 block">Telephone</label>
                      <input
                        type="tel"
                        value={shipping.phone}
                        onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                        placeholder="+216 XX XXX XXX"
                        required
                        className="w-full border border-black/20 px-4 py-3 text-sm outline-none focus:border-gs-black transition-colors font-light placeholder:text-gs-gray"
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    className="w-full btn-gold flex items-center justify-center gap-2 mt-6"
                  >
                    Continuer vers le paiement
                    <FiArrowRight size={14} />
                  </motion.button>
                </motion.form>
              )}

              {/* STEP 2 — PAYMENT */}
              {step === 1 && (
                <motion.form
                  key="payment"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handlePaymentSubmit}
                  className="bg-white rounded-2xl p-8"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <FiCreditCard size={18} className="text-gs-gold" />
                    <h2 className="text-sm tracking-widest uppercase font-semibold">Mode de Paiement</h2>
                  </div>

                  {/* Payment Methods */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {[
                      { id: 'card', label: 'Carte Bancaire', icon: '💳' },
                      { id: 'cash', label: 'A la livraison', icon: '💵' },
                      { id: 'transfer', label: 'Virement', icon: '🏦' },
                    ].map((method) => (
                      <motion.button
                        key={method.id}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setPayment({ ...payment, method: method.id })}
                        className={`p-4 border-2 rounded-xl text-center transition-all ${
                          payment.method === method.id
                            ? 'border-gs-black bg-gs-light'
                            : 'border-black/15 hover:border-black/30'
                        }`}
                      >
                        <div className="text-2xl mb-1">{method.icon}</div>
                        <p className="text-[10px] tracking-wide font-medium">{method.label}</p>
                      </motion.button>
                    ))}
                  </div>

                  {/* Card Form */}
                  <AnimatePresence>
                    {payment.method === 'card' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4"
                      >
                        <div>
                          <label className="label-tag mb-2 block">Numero de carte</label>
                          <input
                            type="text"
                            value={payment.cardNumber}
                            onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            className="w-full border border-black/20 px-4 py-3 text-sm outline-none focus:border-gs-black transition-colors font-light placeholder:text-gs-gray"
                          />
                        </div>
                        <div>
                          <label className="label-tag mb-2 block">Nom sur la carte</label>
                          <input
                            type="text"
                            value={payment.cardName}
                            onChange={(e) => setPayment({ ...payment, cardName: e.target.value })}
                            placeholder="VOTRE NOM"
                            className="w-full border border-black/20 px-4 py-3 text-sm outline-none focus:border-gs-black transition-colors font-light placeholder:text-gs-gray"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="label-tag mb-2 block">Date expiration</label>
                            <input
                              type="text"
                              value={payment.expiry}
                              onChange={(e) => setPayment({ ...payment, expiry: e.target.value })}
                              placeholder="MM/AA"
                              maxLength={5}
                              className="w-full border border-black/20 px-4 py-3 text-sm outline-none focus:border-gs-black transition-colors font-light placeholder:text-gs-gray"
                            />
                          </div>
                          <div>
                            <label className="label-tag mb-2 block">CVV</label>
                            <input
                              type="text"
                              value={payment.cvv}
                              onChange={(e) => setPayment({ ...payment, cvv: e.target.value })}
                              placeholder="123"
                              maxLength={3}
                              className="w-full border border-black/20 px-4 py-3 text-sm outline-none focus:border-gs-black transition-colors font-light placeholder:text-gs-gray"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {payment.method === 'cash' && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-gs-light rounded-xl p-4 text-center"
                      >
                        <p className="text-sm text-gs-gray font-light">
                          Payez en especes a la reception de votre commande.
                        </p>
                      </motion.div>
                    )}

                    {payment.method === 'transfer' && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-gs-light rounded-xl p-4"
                      >
                        <p className="text-xs text-gs-gray font-light mb-2">Virement bancaire vers :</p>
                        <p className="text-sm font-medium">GoShop Maroquinerie</p>
                        <p className="text-xs text-gs-gray font-light">IBAN: TN59 1234 5678 9012 3456 78</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setStep(0)}
                      className="btn-outline-black flex items-center gap-2"
                    >
                      <FiArrowLeft size={14} />
                      Retour
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      type="submit"
                      disabled={loading}
                      className="flex-1 btn-gold flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                      ) : (
                        <>
                          Confirmer la commande
                          <FiArrowRight size={14} />
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.form>
              )}

              {/* STEP 3 — CONFIRMATION */}
              {step === 2 && (
                <motion.div
                  key="confirmation"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-2xl p-12 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <FiCheck size={32} className="text-green-500" />
                  </motion.div>

                  <h2 className="font-display text-4xl font-light italic mb-3">
                    Commande <span className="font-semibold">Confirmee</span>
                  </h2>
                  <p className="text-gs-gray text-sm font-light mb-2">
                    Merci pour votre commande !
                  </p>
                  <p className="text-gs-gray text-sm font-light mb-8">
                    Numero de commande : <span className="text-gs-black font-medium">#GS-2024-001</span>
                  </p>

                  <div className="flex items-center justify-center gap-4 mb-10 text-sm">
                    <div className="flex items-center gap-2 text-gs-gray font-light">
                      <FiPackage size={16} className="text-gs-gold" />
                      Expedition sous 48h
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link to="/">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        className="btn-gold"
                      >
                        Retour a l'accueil
                      </motion.button>
                    </Link>
                    <Link to="/shop">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        className="btn-outline-black"
                      >
                        Continuer les achats
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ORDER SUMMARY */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl p-6 sticky top-28">
              <h3 className="text-sm tracking-widest uppercase font-semibold mb-5">
                Votre Commande
              </h3>

              <div className="space-y-4 mb-5 pb-5 border-b border-black/8">
          {cart.map((item) => (
  <div key={item._id} className="flex items-center gap-3">
    <div className="w-12 h-12 bg-gs-beige rounded-lg flex items-center justify-center flex-shrink-0">
      {item.product?.images?.[0] ? (
        <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover rounded-lg" />
      ) : (
        <span className="text-xl">👜</span>
      )}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-medium truncate">{item.product?.name}</p>
      <p className="text-[10px] text-gs-gray font-light">
        {item.size} / {item.color} x{item.quantity}
      </p>
    </div>
    <p className="text-xs font-semibold flex-shrink-0">
      {(item.product?.price || 0) * item.quantity} TND
    </p>
  </div>
))}
              </div>

              <div className="space-y-2 mb-4 pb-4 border-b border-black/8">
                <div className="flex justify-between text-xs">
                  <span className="text-gs-gray font-light">Sous-total</span>
                  <span>{subtotal} TND</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gs-gray font-light">Livraison</span>
                  <span className={shippingCost === 0 ? 'text-green-600' : ''}>
                    {shippingCost === 0 ? 'Gratuite' : `${shippingCost} TND`}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs tracking-widest uppercase font-semibold">Total</span>
                <span className="font-display text-2xl font-semibold">{total} TND</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;