import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const posts = [
  { id: 1, emoji: '👜', bg: 'bg-[#f0ebe4]' },
  { id: 2, emoji: '💼', bg: 'bg-[#e8e4de]' },
  { id: 3, emoji: '👝', bg: 'bg-[#ede8e0]' },
  { id: 4, emoji: '🎒', bg: 'bg-[#e4e8ed]' },
  { id: 5, emoji: '👛', bg: 'bg-[#ece9e4]' },
  { id: 6, emoji: '💍', bg: 'bg-[#e9e4ec]' },
];

const InstagramBanner = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-20 px-6 md:px-12 bg-gs-white">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <p className="label-tag text-gs-gold mb-3">Suivez-nous</p>
          <h2 className="font-display text-4xl md:text-5xl font-light italic">
            Rejoignez-nous sur Instagram{' '}
            <span className="font-semibold">@GoShop</span>
          </h2>
        </motion.div>

        {/* Grid photos */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <motion.a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
                className={`${post.bg} aspect-square flex items-center justify-center rounded-xl overflow-hidden group relative cursor-pointer block`}
              >
                <span className="text-4xl">{post.emoji}</span>

                {/* Hover overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-xl"
                >
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </motion.div>
              </motion.a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstagramBanner;