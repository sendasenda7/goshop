import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiHome, FiSearch } from 'react-icons/fi';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gs-white flex flex-col items-center justify-center px-6 relative overflow-hidden">

      {/* Background decoration */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute top-20 right-20 w-96 h-96 rounded-full bg-gs-gold/5 blur-3xl"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute bottom-20 left-20 w-64 h-64 rounded-full bg-black/5 blur-3xl"
      />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="absolute top-8 left-1/2 -translate-x-1/2"
      >
        <Link to="/">
          <div className="font-display text-2xl font-light tracking-widest">
            Go<span className="font-semibold">Shop</span>
          </div>
        </Link>
      </motion.div>

      {/* 404 Number */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative mb-6"
      >
        <div className="font-display text-[180px] md:text-[220px] font-semibold leading-none text-black/5 select-none">
          404
        </div>
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [-2, 2, -2] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="text-7xl">👜</span>
        </motion.div>
      </motion.div>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center mb-10"
      >
        <h1 className="font-display text-4xl md:text-5xl font-light italic mb-3">
          Page <span className="font-semibold">Introuvable</span>
        </h1>
        <p className="text-gs-gray text-sm font-light max-w-xs mx-auto leading-relaxed">
          La page que vous recherchez n'existe pas ou a ete deplacee.
        </p>
      </motion.div>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="w-16 h-px bg-gs-gold mb-10 origin-center"
      />

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-gold flex items-center gap-2"
          >
            <FiHome size={14} />
            Retour a l'accueil
          </motion.button>
        </Link>
        <Link to="/shop">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-outline-black flex items-center gap-2"
          >
            <FiSearch size={14} />
            Voir la boutique
          </motion.button>
        </Link>
      </motion.div>

      {/* Back link */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        onClick={() => window.history.back()}
        className="mt-8 flex items-center gap-2 label-tag hover:text-gs-black transition-colors"
      >
        <FiArrowLeft size={12} />
        Page precedente
      </motion.button>
    </div>
  );
};

export default NotFoundPage;