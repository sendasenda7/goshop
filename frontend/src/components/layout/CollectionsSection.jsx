import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { categoryImages } from '../../utils/images';

const collections = [
  {
    id: 1,
    name: 'FEMME',
    subtitle: 'Sacs & Accessoires',
    count: '48 pièces',
    bg: 'bg-[#f0ebe4]',
    emoji: '👜',
  },
  {
    id: 2,
    name: 'HOMME',
    subtitle: 'Maroquinerie',
    count: '24 pièces',
    bg: 'bg-[#e8e4de]',
    emoji: '💼',
  },
  {
    id: 3,
    name: 'CADEAUX',
    subtitle: 'Idées Cadeaux',
    count: '32 pièces',
    bg: 'bg-[#ede8e0]',
    emoji: '🎁',
  },
  {
    id: 4,
    name: 'SS26',
    subtitle: 'Nouvelle Collection',
    count: '16 pièces',
    bg: 'bg-[#e4e8ed]',
    emoji: '✨',
  },
];

const CollectionsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-24 px-6 md:px-12 bg-gs-light">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="label-tag text-gs-gold mb-3">Notre Univers</p>
          <h2 className="font-display text-5xl md:text-6xl font-light italic">
            Nos <span className="font-semibold">Collections</span>
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {collections.map((col, i) => (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <Link to={`/shop?cat=${col.name.toLowerCase()}`}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3 }}
                  className={`${col.bg} rounded-2xl p-8 aspect-square flex flex-col items-center justify-center text-center group cursor-pointer relative overflow-hidden`}
                >
                  {/* Hover border */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 border-2 border-gs-gold rounded-2xl"
                  />

                  {/* Emoji */}
<img
  src={categoryImages[col.name] || categoryImages['Femme']}
  alt={col.name}
  className="w-full h-full object-cover rounded-2xl"
/>

                  {/* Text */}
                  <h3 className="font-black text-gs-black text-xl tracking-widest mb-1">
                    {col.name}
                  </h3>
                  <p className="text-gs-gray text-xs font-light tracking-wide mb-2">
                    {col.subtitle}
                  </p>
                  <p className="text-gs-gold text-xs tracking-widest uppercase font-light">
                    {col.count}
                  </p>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mt-8 bg-gs-black rounded-2xl p-12 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div>
            <p className="label-tag text-gs-gold mb-2">Offre Limitée</p>
            <h3 className="font-display text-4xl md:text-5xl font-light italic text-white">
              Livraison Gratuite <span className="font-semibold">dès 200 TND</span>
            </h3>
          </div>
          <Link to="/shop">
            <motion.button
              whileHover={{ scale: 1.03, backgroundColor: '#c9a96e' }}
              whileTap={{ scale: 0.97 }}
              className="bg-white text-gs-black text-xs tracking-widest uppercase px-10 py-4 font-semibold transition-all duration-300 whitespace-nowrap"
            >
              Shopper Maintenant
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CollectionsSection;