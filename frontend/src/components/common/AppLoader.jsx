import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AppLoader = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-gs-white z-[100] flex flex-col items-center justify-center"
          >
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-center mb-8"
            >
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="text-5xl mb-4"
              >
                👜
              </motion.div>
              <div className="font-display text-4xl font-light tracking-[0.2em] uppercase">
                Go<span className="font-semibold">Shop</span>
              </div>
              <p className="text-xs tracking-[0.3em] uppercase text-gs-gray font-light mt-2">
                Maroquinerie de Luxe
              </p>
            </motion.div>

            {/* Progress bar */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '120px' }}
              transition={{ delay: 0.5, duration: 1.2, ease: 'easeInOut' }}
              className="h-px bg-gs-gold"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.4 }}
      >
        {children}
      </motion.div>
    </>
  );
};

export default AppLoader;