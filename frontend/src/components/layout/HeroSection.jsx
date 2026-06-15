import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { heroImages } from '../../utils/images';

const HeroSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen bg-gs-white overflow-hidden pt-28">

      {/* HERO LAYOUT */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-0 min-h-[85vh] items-center">

        {/* LEFT — Text */}
        <motion.div style={{ y: textY, opacity }} className="flex flex-col justify-center z-10 order-2 md:order-1 py-12 md:py-0">

          {/* Tag */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="label-tag mb-6 text-gs-gold"
          >
            Nouvelle Collection — SS26
          </motion.p>

          {/* Big Title */}
          <div className="overflow-hidden mb-2">
            <motion.h1
              initial={{ y: 80 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-6xl md:text-8xl font-light italic leading-none text-gs-black"
            >
              L'Art du
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-6">
            <motion.h1
              initial={{ y: 80 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.65, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-6xl md:text-8xl font-semibold leading-none text-gs-black"
            >
              Cuir Véritable
            </motion.h1>
          </div>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="w-16 h-px bg-gs-gold mb-6 origin-left"
          />

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="text-gs-gray text-sm font-light leading-relaxed max-w-xs mb-10"
          >
            Chaque pièce raconte une histoire. Façonnée à la main depuis 1986, notre maroquinerie allie tradition et modernité.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link to="/shop">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-gold flex items-center gap-3"
              >
                Découvrir la Collection
                <FiArrowRight size={14} strokeWidth={1.5} />
              </motion.button>
            </Link>
            <Link to="/collections">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-outline-black"
              >
                Nos Boutiques
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* RIGHT — Product Image 3D */}
        <motion.div
          style={{ y: imgY }}
          className="relative flex items-center justify-center order-1 md:order-2 h-[50vh] md:h-[85vh]"
        >
          
          {/* Background shape */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="absolute inset-8 bg-gs-beige rounded-3xl"
          />

          {/* Floating bag image */}
          <motion.div
            animate={{ y: [0, -16, 0], rotate: [-1, 1, -1] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="relative z-10 w-72 md:w-96"
          >
            {/* Shadow */}
            <motion.div
              animate={{ scaleX: [1, 0.9, 1], opacity: [0.3, 0.15, 0.3] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-6 bg-black/20 blur-xl rounded-full"
            />

{/* Product image */}
<img
  src={heroImages.hero1}
  alt="GoShop Hero"
  className="relative w-full rounded-2xl shadow-2xl object-cover aspect-square"
/>
          </motion.div>

          {/* Badge NEW */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.3, type: 'spring' }}
            className="absolute top-12 right-8 bg-gs-black text-white text-[10px] tracking-widest uppercase px-4 py-2 rounded-full"
          >
            SS26 Is Live
          </motion.div>

          {/* Price tag */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-16 right-4 bg-white shadow-xl rounded-xl px-4 py-3 border border-black/5"
          >
            <p className="text-[10px] tracking-widest uppercase text-gs-gray mb-1">À partir de</p>
            <p className="font-display text-2xl font-semibold">299 TND</p>
          </motion.div>
        </motion.div>
      </div>

      {/* MARQUEE BANNER */}
      <div className="border-t border-b border-black/10 overflow-hidden py-3 bg-gs-black mt-8">
        <motion.div className="flex whitespace-nowrap animate-marquee">
          {Array(8).fill('NOUVELLE COLLECTION — CUIR VÉRITABLE — SS26 — FAIT MAIN — ').map((text, i) => (
            <span key={i} className="text-white/50 text-xs tracking-[0.3em] uppercase mx-6 font-light">
              {text}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;