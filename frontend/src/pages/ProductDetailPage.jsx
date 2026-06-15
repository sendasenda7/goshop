import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiArrowLeft, FiStar, FiTruck, FiRefreshCw, FiShield } from 'react-icons/fi';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { getProductImage } from '../utils/images';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import toast from 'react-hot-toast';

const mockProduct = {
  _id: '1',
  name: 'The Dome',
  category: 'Femme',
  brand: 'GoShop',
  price: 380,
  oldPrice: 450,
  description: 'Le sac iconique de la maison GoShop. Confectionne en cuir pebble de haute qualite, il se distingue par ses lignes epurees et sa fermeture eclair doree. Un accessoire intemporel qui accompagne chaque moment de votre quotidien.',
  images: [],
  sizes: ['XS', 'S', 'M', 'L'],
  colors: ['beige', 'noir', 'vert', 'creme'],
  stock: 12,
  rating: 4.8,
  numReviews: 24,
  isNew: true,
  isSale: true,
  reviews: [
    { _id: 'r1', name: 'Sarah M.', rating: 5, comment: 'Magnifique sac, qualite exceptionnelle. Je suis ravie de mon achat !', createdAt: '2024-03-15' },
    { _id: 'r2', name: 'Leila B.', rating: 5, comment: 'Tres beau produit, cuir doux et solide. Livraison rapide.', createdAt: '2024-02-28' },
    { _id: 'r3', name: 'Amira K.', rating: 4, comment: 'Bonne qualite, correspond bien aux photos. Je recommande.', createdAt: '2024-02-10' },
  ],
};

const relatedProducts = [
  { _id: '2', name: 'Neon Noir', price: 450, category: 'Femme', emoji: '👜' },
  { _id: '3', name: 'Monolith', price: 320, category: 'Homme', emoji: '💼' },
  { _id: '4', name: 'The Classic', price: 290, category: 'Femme', emoji: '👝' },
  { _id: '7', name: 'SS26 Tote', price: 420, category: 'Collections', emoji: '🎒' },
];

const colorMap = {
  beige: '#d4b896',
  noir: '#0a0a0a',
  vert: '#7a9e7e',
  creme: '#f5f0e8',
  rose: '#f4a5b5',
  taupe: '#b5a49a',
};

const ProductDetailPage = () => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { id } = useParams();
  const [product, setProduct] = useState(mockProduct);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data.product);
      } catch (err) {
        console.error(err);
        setProduct(mockProduct);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [activeImage, setActiveImage] = useState(0);
  const reviewRef = useRef(null);

  // Utilise le vrai WishlistContext
  const wished = isInWishlist(product._id);

  const handleToggleWishlist = async () => {
    try {
      if (wished) {
        await removeFromWishlist(product._id);
        toast.success('Retiré de la wishlist');
      } else {
        await addToWishlist(product._id);
        toast.success('Ajouté à la wishlist ❤️');
      }
    } catch (err) {
      toast.error('Erreur wishlist');
    }
  };

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast.error('Veuillez choisir une taille');
      return;
    }
    await addToCart(product._id, quantity, selectedSize, selectedColor);
    toast.success(`${product.name} ajoute au panier !`);
  };

  return (
    <div className="min-h-screen bg-gs-white">
      <Navbar />

      <div className="pt-24 max-w-7xl mx-auto px-6 md:px-12 py-10">

        {/* BREADCRUMB */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-8"
        >
          <Link to="/" className="label-tag hover:text-gs-black transition-colors">Accueil</Link>
          <span className="text-gs-gray text-xs">/</span>
          <Link to="/shop" className="label-tag hover:text-gs-black transition-colors">Boutique</Link>
          <span className="text-gs-gray text-xs">/</span>
          <span className="label-tag text-gs-black">{product.name}</span>
        </motion.div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">

          {/* LEFT — Images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative bg-gs-beige rounded-2xl aspect-square flex items-center justify-center mb-3 overflow-hidden">
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [-1, 1, -1] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="text-center"
              >
                <img
                  src={getProductImage(product.name)}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <p className="text-xs text-gs-gray font-light tracking-widest uppercase">
                  {product.name}
                </p>
              </motion.div>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && (
                  <span className="bg-gs-black text-white text-[9px] tracking-widest uppercase px-3 py-1.5">
                    Nouveau
                  </span>
                )}
                {discount > 0 && (
                  <span className="bg-red-500 text-white text-[9px] tracking-widest uppercase px-3 py-1.5">
                    -{discount}%
                  </span>
                )}
              </div>

              {/* Wishlist button */}
              <button
                onClick={handleToggleWishlist}
                className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
              >
                <FiHeart
                  size={16}
                  className={wished ? 'fill-red-500 text-red-500' : 'text-gs-gray'}
                />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-2">
              {[0, 1, 2, 3].map((i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => setActiveImage(i)}
                  className={`bg-gs-beige rounded-xl aspect-square flex items-center justify-center border-2 transition-colors ${
                    activeImage === i ? 'border-gs-black' : 'border-transparent'
                  }`}
                >
                  <img
                    src={getProductImage(product.name)}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* RIGHT — Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex flex-col"
          >
            <p className="label-tag text-gs-gold mb-2">{product.category}</p>
            <h1 className="font-display text-5xl font-light italic mb-2">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-sm ${i < Math.round(product.rating) ? 'text-gs-gold' : 'text-black/20'}`}>
                    ★
                  </span>
                ))}
              </div>
              <span className="text-xs text-gs-gray font-light">
                {product.rating} ({product.numReviews} avis)
              </span>
              <button
                onClick={() => reviewRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="text-xs text-gs-gold underline font-light"
              >
                Voir les avis
              </button>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-8 pb-8 border-b border-black/10">
              <span className="font-display text-4xl font-semibold">{product.price} TND</span>
              {product.oldPrice > 0 && (
                <span className="text-lg text-gs-gray line-through font-light">{product.oldPrice} TND</span>
              )}
              {discount > 0 && (
                <span className="bg-red-50 text-red-500 text-xs px-2 py-1 font-medium">-{discount}%</span>
              )}
            </div>

            {/* Colors */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="label-tag">Couleur</span>
                <span className="text-xs text-gs-gray font-light capitalize">{selectedColor}</span>
              </div>
              <div className="flex items-center gap-2">
                {product.colors.map((color) => (
                  <motion.button
                    key={color}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === color ? 'border-gs-black scale-110' : 'border-transparent hover:border-black/30'
                    }`}
                    style={{ backgroundColor: colorMap[color] || '#ccc' }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="label-tag">Taille</span>
                <button className="text-xs text-gs-gold underline font-light">Guide des tailles</button>
              </div>
              <div className="flex items-center gap-2">
                {product.sizes.map((size) => (
                  <motion.button
                    key={size}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 text-xs font-medium border transition-all ${
                      selectedSize === size
                        ? 'bg-gs-black text-white border-gs-black'
                        : 'border-black/20 text-gs-gray hover:border-gs-black hover:text-gs-black'
                    }`}
                  >
                    {size}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <span className="label-tag mb-3 block">Quantite</span>
              <div className="flex items-center gap-0 w-32 border border-black/20">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gs-light transition-colors text-lg"
                >
                  -
                </button>
                <span className="flex-1 text-center text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gs-light transition-colors text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3 mb-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className="flex-1 btn-gold flex items-center justify-center gap-2"
              >
                <FiShoppingBag size={16} />
                Ajouter au Panier
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleToggleWishlist}
                className="w-14 border border-black/20 flex items-center justify-center hover:border-gs-black transition-colors"
              >
                <FiHeart size={16} className={wished ? 'fill-red-500 text-red-500' : ''} />
              </motion.button>
            </div>

            {/* Services */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-black/10">
              {[
                { icon: <FiTruck size={16} />, text: 'Livraison gratuite', sub: 'des 200 TND' },
                { icon: <FiRefreshCw size={16} />, text: 'Retours gratuits', sub: 'sous 30 jours' },
                { icon: <FiShield size={16} />, text: 'Paiement securise', sub: '100% protege' },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="flex justify-center mb-1 text-gs-gold">{item.icon}</div>
                  <p className="text-[10px] font-medium tracking-wide">{item.text}</p>
                  <p className="text-[10px] text-gs-gray font-light">{item.sub}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* TABS */}
        <div className="mb-16">
          <div className="flex border-b border-black/10 mb-8">
            {['description', 'details', 'avis'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-xs tracking-widest uppercase px-6 py-4 transition-all relative ${
                  activeTab === tab ? 'text-gs-black' : 'text-gs-gray hover:text-gs-black'
                }`}
              >
                {tab === 'avis' ? `Avis (${product.numReviews})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gs-black"
                  />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'description' && (
              <motion.div
                key="description"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="max-w-2xl"
              >
                <p className="text-sm text-gs-gray font-light leading-relaxed">
                  {product.description}
                </p>
              </motion.div>
            )}

            {activeTab === 'details' && (
              <motion.div
                key="details"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="max-w-2xl"
              >
                <div className="space-y-3">
                  {[
                    ['Matiere', 'Cuir veritable pebble'],
                    ['Doublure', 'Textile premium'],
                    ['Fermeture', 'Zip dore'],
                    ['Dimensions', '30 x 22 x 12 cm'],
                    ['Bandouliere', 'Amovible et reglable'],
                    ['Origine', 'Tunisie'],
                  ].map(([key, val]) => (
                    <div key={key} className="flex items-center gap-4 py-2 border-b border-black/5">
                      <span className="label-tag w-28">{key}</span>
                      <span className="text-sm font-light text-gs-gray">{val}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'avis' && (
              <motion.div
                key="avis"
                ref={reviewRef}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="max-w-2xl space-y-6"
              >
                {product.reviews.map((review) => (
                  <div key={review._id} className="border-b border-black/5 pb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{review.name}</span>
                      <span className="text-xs text-gs-gray font-light">{review.createdAt}</span>
                    </div>
                    <div className="flex mb-2">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-sm ${i < review.rating ? 'text-gs-gold' : 'text-black/20'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-gs-gray font-light">{review.comment}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RELATED PRODUCTS */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-3xl font-light italic">
              Vous aimerez <span className="font-semibold">aussi</span>
            </h2>
            <Link to="/shop" className="label-tag hover:text-gs-black transition-colors">
              Voir tout
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((p, i) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={`/product/${p._id}`}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="bg-gs-beige rounded-xl aspect-square flex items-center justify-center mb-3 cursor-pointer"
                  >
                    <span className="text-5xl">{p.emoji}</span>
                  </motion.div>
                  <h4 className="text-sm font-medium tracking-wide hover:text-gs-gold transition-colors">{p.name}</h4>
                  <p className="text-xs text-gs-gray font-light">{p.category}</p>
                  <p className="text-sm font-semibold mt-1">{p.price} TND</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;