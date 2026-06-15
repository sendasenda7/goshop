import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { getProductImage } from '../../utils/images';

const drops = [
  {
    id: 1,
    tag: 'LIMITED',
    tagColor: 'text-cyan-400',
    name: 'NEON NOIR',
    desc: 'Sac en cuir grainé noir mat, finitions dorées',
    price: '450 TND',
    bg: 'from-gray-900 to-black',
  },
  {
    id: 2,
    tag: 'NEW ERA',
    tagColor: 'text-pink-400',
    name: 'MONOLITH',
    desc: 'Pochette minimaliste en cuir lisse taupe',
    price: '320 TND',
    bg: 'from-gray-800 to-gray-900',
  },
  {
    id: 3,
    tag: 'BEST SELLER',
    tagColor: 'text-gs-gold',
    name: 'THE DOME',
    desc: 'Vanity case iconique en cuir pebblé',
    price: '380 TND',
    bg: 'from-stone-800 to-stone-900',
  },
];

const FeaturedDrops = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-24 px-6 md:px-12 bg-gs-white">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-end justify-between mb-14">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <p className="label-tag text-gs-gold mb-3">Drops Exclusifs</p>
            <h2 className="font-display text-5xl md:text-6xl font-light italic">
              Pièces <span className="font-semibold">Signature</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
          >
            <Link
              to="/shop"
              className="hidden md:flex items-center gap-2 label-tag hover:text-gs-gold transition-colors"
            >
              VOIR TOUT <FiArrowRight size={14} />
            </Link>
          </motion.div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {drops.map((drop, i) => (
            <motion.div
              key={drop.id}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.7 }}
            >
              <Link to={`/product/${drop.id}`}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.01 }}
                  transition={{ duration: 0.4 }}
                  className={`relative bg-gradient-to-br ${drop.bg} rounded-2xl overflow-hidden cursor-pointer group`}
                >
                  {/* Image placeholder */}
                  <div className="aspect-[3/4] flex items-center justify-center p-8">
<img
  src={getProductImage(drop.name)}
  alt={drop.name}
  className="w-full h-full object-cover absolute inset-0 rounded-2xl"
/>

                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Hover overlay */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 bg-white/5 backdrop-blur-sm flex items-center justify-center"
                    >
                      <span className="border border-white/50 text-white text-xs tracking-widest uppercase px-6 py-3">
                        Voir le Produit
                      </span>
                    </motion.div>
                  </div>

                  {/* Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className={`text-xs tracking-widest uppercase font-light mb-1 ${drop.tagColor}`}>
                      {drop.tag}
                    </p>
                    <h3 className="text-white font-black text-2xl tracking-wider mb-1">
                      {drop.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-white/50 text-xs font-light">{drop.desc}</p>
                      <p className="text-white font-semibold text-sm">{drop.price}</p>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile View All */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center md:hidden"
        >
          <Link to="/shop" className="btn-outline-black inline-block">
            Voir Tout
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedDrops;