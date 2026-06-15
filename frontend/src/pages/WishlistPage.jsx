import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiTrash2, FiArrowRight } from 'react-icons/fi';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const colorMap = {
  beige: '#d4b896', noir: '#0a0a0a', vert: '#7a9e7e',
  creme: '#f5f0e8', rose: '#f4a5b5', taupe: '#b5a49a',
  rouge: '#c0392b', marron: '#6b4226',
};

const WishlistPage = () => {
  const { wishlist, removeFromWishlist, moveAllToCart, clearWishlist } = useWishlist();
  const { addToCart, fetchCart } = useCart();

  const moveToCart = async (item) => {
    const product = item.product;
    if (!product) return;
    try {
      await addToCart(product._id, 1, product.sizes?.[0] || '', product.colors?.[0] || '');
      await removeFromWishlist(product._id);
    } catch (err) {
      console.error('Erreur ajout panier:', err);
    }
  };

  const handleMoveAllToCart = async () => {
    try {
      await moveAllToCart();
      await fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gs-white">
      <Navbar />

      <div className="pt-28 pb-16 px-6 md:px-12 max-w-7xl mx-auto">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <p className="label-tag text-gs-gold mb-2">Mes Favoris</p>
            <h1 className="font-display text-5xl font-light italic">
              Ma <span className="font-semibold">Wishlist</span>
            </h1>
            <p className="text-gs-gray text-sm font-light mt-1">
              {wishlist.length} article{wishlist.length > 1 ? 's' : ''} sauvegarde{wishlist.length > 1 ? 's' : ''}
            </p>
          </div>

          {wishlist.length > 0 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.02 }}
              onClick={clearWishlist}
              className="flex items-center gap-2 text-xs tracking-widest uppercase text-gs-gray hover:text-red-500 transition-colors border border-black/15 hover:border-red-200 px-4 py-2"
            >
              <FiTrash2 size={12} />
              Tout supprimer
            </motion.button>
          )}
        </motion.div>

        {wishlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-8xl mb-6"
            >
              🤍
            </motion.div>
            <h2 className="font-display text-4xl font-light italic mb-3">
              Votre wishlist est vide
            </h2>
            <p className="text-gs-gray text-sm font-light mb-8 max-w-xs mx-auto">
              Sauvegardez vos pieces preferees pour les retrouver facilement
            </p>
            <Link to="/shop">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-gold inline-flex items-center gap-2"
              >
                <FiHeart size={14} />
                Decouvrir la Boutique
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <AnimatePresence>
                {wishlist.map((item, i) => {
                  const product = item.product;
                  if (!product) return null;

                  const discountPercent = product.oldPrice > 0
                    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
                    : 0;

                  return (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: i * 0.08, duration: 0.4 }}
                      className="group relative"
                    >
                      <div className="relative bg-gs-beige rounded-2xl aspect-[3/4] flex items-center justify-center mb-3 overflow-hidden">

                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-7xl">👜</div>
                        )}

                        <div className="absolute top-3 left-3 flex flex-col gap-1">
                          {product.isNew && (
                            <span className="bg-gs-black text-white text-[9px] tracking-widest uppercase px-2.5 py-1">
                              Nouveau
                            </span>
                          )}
                          {discountPercent > 0 && (
                            <span className="bg-red-500 text-white text-[9px] tracking-widest uppercase px-2.5 py-1">
                              -{discountPercent}%
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => removeFromWishlist(product._id)}
                          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-red-50 transition-colors"
                        >
                          <FiHeart size={14} className="fill-red-400 text-red-400" />
                        </button>

                        <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <Link to={`/product/${product._id}`} className="flex-1">
                            <button className="w-full bg-white text-gs-black text-[10px] tracking-widest uppercase py-2.5 hover:bg-gs-black hover:text-white transition-colors">
                              Voir
                            </button>
                          </Link>
                          <button
                            onClick={() => moveToCart(item)}
                            className="flex-1 bg-gs-black text-white text-[10px] tracking-widest uppercase py-2.5 flex items-center justify-center gap-1 hover:bg-gs-gold transition-colors"
                          >
                            <FiShoppingBag size={11} />
                            Panier
                          </button>
                        </div>
                      </div>

                      <div className="px-1">
                        <Link to={`/product/${product._id}`}>
                          <h3 className="text-sm font-medium tracking-wide hover:text-gs-gold transition-colors mb-1">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-xs text-gs-gray font-light mb-2">{product.category}</p>
                        {product.colors?.length > 0 && (
                          <div className="flex items-center gap-1 mb-2">
                            {product.colors.slice(0, 3).map((color) => (
                              <div
                                key={color}
                                className="w-3 h-3 rounded-full border border-black/10"
                                style={{ backgroundColor: colorMap[color] || '#ccc' }}
                                title={color}
                              />
                            ))}
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{product.price} TND</span>
                          {product.oldPrice > 0 && (
                            <span className="text-xs text-gs-gray line-through font-light">
                              {product.oldPrice} TND
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gs-light rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6"
            >
              <div>
                <h3 className="font-display text-2xl font-light italic mb-1">
                  Pret a commander ?
                </h3>
                <p className="text-xs text-gs-gray font-light">
                  Ajoutez tous vos articles favoris au panier en un clic
                </p>
              </div>
              <div className="flex gap-3">
                <Link to="/shop">
                  <motion.button whileHover={{ scale: 1.02 }} className="btn-outline-black flex items-center gap-2">
                    Continuer mes achats
                  </motion.button>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleMoveAllToCart}
                  className="btn-gold flex items-center gap-2"
                >
                  <FiShoppingBag size={14} />
                  Tout ajouter au panier
                  <FiArrowRight size={14} />
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default WishlistPage;