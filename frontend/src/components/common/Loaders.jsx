import { motion } from 'framer-motion';

// SPINNER
export const Spinner = ({ size = 'md', color = 'black' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  const colors = { black: 'border-black/20 border-t-black', gold: 'border-gs-gold/20 border-t-gs-gold', white: 'border-white/20 border-t-white' };

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className={`rounded-full border-2 ${sizes[size]} ${colors[color]}`}
    />
  );
};

// FULL PAGE LOADER
export const PageLoader = () => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="text-6xl mb-6"
        >
          👜
        </motion.div>
        <div className="font-display text-2xl font-light tracking-widest mb-4">
          Go<span className="font-semibold">Shop</span>
        </div>
        <div className="flex justify-center">
          <Spinner size="md" color="gold" />
        </div>
      </motion.div>
    </div>
  );
};

// PRODUCT CARD SKELETON
export const ProductCardSkeleton = () => {
  return (
    <div className="group relative animate-pulse">
      <div className="bg-gray-100 rounded-xl aspect-[3/4] mb-3" />
      <div className="px-1 space-y-2">
        <div className="h-3 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="h-3 bg-gray-100 rounded w-1/4" />
      </div>
    </div>
  );
};

// SHOP PAGE SKELETON
export const ShopSkeleton = ({ viewMode = 'grid' }) => {
  return (
    <div
      className={`grid gap-4 ${
        viewMode === 'grid'
          ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
          : 'grid-cols-1 md:grid-cols-2'
      }`}
    >
      {Array(8).fill(0).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};

// PRODUCT DETAIL SKELETON
export const ProductDetailSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
      <div>
        <div className="bg-gray-100 rounded-2xl aspect-square mb-3" />
        <div className="grid grid-cols-4 gap-2">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl aspect-square" />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div className="h-3 bg-gray-100 rounded w-1/4" />
        <div className="h-8 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/3" />
        <div className="h-6 bg-gray-100 rounded w-1/4" />
        <div className="space-y-2">
          <div className="h-3 bg-gray-100 rounded w-full" />
          <div className="h-3 bg-gray-100 rounded w-5/6" />
          <div className="h-3 bg-gray-100 rounded w-4/6" />
        </div>
      </div>
    </div>
  );
};

// INLINE LOADER
export const InlineLoader = ({ text = 'Chargement...' }) => {
  return (
    <div className="flex items-center justify-center gap-3 py-12">
      <Spinner size="sm" color="gold" />
      <span className="text-xs tracking-widest uppercase text-gs-gray font-light">{text}</span>
    </div>
  );
};

export default Spinner;