import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiEye } from 'react-icons/fi';
import { getProductImage } from '../../utils/images';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product, index = 0 }) => {
  const [hovered, setHovered] = useState(false);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const wished = isInWishlist(product._id);

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
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

  const handleAddToCart = async (e) => {
    e.preventDefault();
    try {
      const defaultSize = product.sizes?.[0] || '';
      const defaultColor = product.colors?.[0] || '';
      await addToCart(product._id, 1, defaultSize, defaultColor);
      toast.success(`${product.name} ajouté au panier !`);
    } catch (err) {
      toast.error('Erreur ajout panier');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group relative"
    >
      {/* IMAGE */}
      <div className="relative overflow-hidden bg-gs-beige rounded-xl aspect-[3/4] mb-3">

        <motion.div
          animate={{ scale: hovered ? 1.05 : 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full"
        >
          <img
            src={product.images?.[0] || getProductImage(product.name)}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = getProductImage('default'); }}
          />
        </motion.div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.isNew && (
            <span className="bg-gs-black text-white text-[9px] tracking-widest uppercase px-2.5 py-1">
              Nouveau
            </span>
          )}
          {product.isSale && discount > 0 && (
            <span className="bg-red-500 text-white text-[9px] tracking-widest uppercase px-2.5 py-1">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        >
          <FiHeart
            size={14}
            className={wished ? 'fill-red-500 text-red-500' : 'text-gs-gray'}
          />
        </button>

        {/* Hover actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 10 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-3 left-3 right-3 flex gap-2"
        >
          <Link
            to={`/product/${product._id}`}
            className="flex-1 bg-white text-gs-black text-[10px] tracking-widest uppercase py-2.5 flex items-center justify-center gap-1.5 hover:bg-gs-black hover:text-white transition-colors"
          >
            <FiEye size={12} />
            Voir
          </Link>
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-gs-black text-white text-[10px] tracking-widest uppercase py-2.5 flex items-center justify-center gap-1.5 hover:bg-gs-gold transition-colors"
          >
            <FiShoppingBag size={12} />
            Ajouter
          </button>
        </motion.div>
      </div>

      {/* INFO */}
      <div className="px-1">
        <div className="flex items-start justify-between mb-1">
          <Link to={`/product/${product._id}`}>
            <h3 className="text-sm font-medium tracking-wide hover:text-gs-gold transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>

        <p className="text-xs text-gs-gray font-light mb-2">{product.category}</p>

        {/* Colors */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1 mb-2">
            {product.colors.slice(0, 3).map((color) => (
              <div
                key={color}
                className="w-3 h-3 rounded-full border border-black/10"
                style={{
                  backgroundColor:
                    color === 'beige' ? '#d4b896' :
                    color === 'noir' ? '#0a0a0a' :
                    color === 'rose' ? '#f4a5b5' :
                    color === 'vert' ? '#7a9e7e' :
                    color === 'creme' ? '#f5f0e8' :
                    color === 'taupe' ? '#b5a49a' :
                    color === 'rouge' ? '#c0392b' :
                    color === 'marron' ? '#6b4226' : '#ccc'
                }}
                title={color}
              />
            ))}
            {product.colors.length > 3 && (
              <span className="text-[10px] text-gs-gray">+{product.colors.length - 3}</span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gs-black">
            {product.price} TND
          </span>
          {product.oldPrice > 0 && (
            <span className="text-xs text-gs-gray line-through font-light">
              {product.oldPrice} TND
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-[10px] ${i < Math.round(product.rating) ? 'text-gs-gold' : 'text-black/20'}`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-[10px] text-gs-gray font-light">({product.numReviews})</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;