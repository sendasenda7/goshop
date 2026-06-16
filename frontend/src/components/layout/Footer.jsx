import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const Footer = () => {
  const [email, setEmail] = useState('');
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const handleNewsletter = (e) => {
    e.preventDefault();
    alert('Merci vous etes inscrit');
    setEmail('');
  };

  const services = ['Mon Compte', 'Suivi Commande', 'Retours', 'SAV'];
  const infos = ['Contact', 'FAQ', 'Mentions Legales', 'Confidentialite'];
  const boutiques = ['Femme', 'Homme', 'Cadeaux', 'Collections'];
  const payments = ['VISA', 'MC', 'PayPal'];

  return (
    <footer ref={ref} className="bg-gs-black text-white">

      <div className="border-b border-white/10 py-8 px-6 md:px-12 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="font-display text-2xl md:text-3xl font-light italic tracking-wide"
        >
          REJOIGNEZ-NOUS SUR INSTAGRAM
          {' '}
          <span className="font-semibold text-gs-gold">@GOSHOP</span>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-2 md:grid-cols-5 gap-10">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="col-span-2 md:col-span-1"
        >
          <div className="font-display text-2xl font-light tracking-widest mb-4">
            Go<span className="font-semibold">Shop</span>
          </div>
          <p className="text-white/40 text-xs font-light leading-relaxed">
            Maroquinerie de luxe artisanale. Faconnee a la main depuis 1986.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
        >
          <h4 className="text-xs tracking-widest uppercase font-semibold mb-6">Services</h4>
          <ul className="space-y-3">
            {services.map((item) => (
              <li key={item}>
                <Link to="/profile" className="text-white/40 text-xs font-light hover:text-gs-gold transition-colors tracking-wide">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
        >
          <h4 className="text-xs tracking-widest uppercase font-semibold mb-6">Informations</h4>
          <ul className="space-y-3">
            {infos.map((item) => (
              <li key={item}>
                <Link to="/" className="text-white/40 text-xs font-light hover:text-gs-gold transition-colors tracking-wide">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
        >
          <h4 className="text-xs tracking-widest uppercase font-semibold mb-6">Boutiques</h4>
          <ul className="space-y-3">
            {boutiques.map((item) => (
              <li key={item}>
                <Link to={`/shop?cat=${item.toLowerCase()}`} className="text-white/40 text-xs font-light hover:text-gs-gold transition-colors tracking-wide">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
        >
          <h4 className="text-xs tracking-widest uppercase font-semibold mb-6">Newsletter</h4>
          <form onSubmit={handleNewsletter} className="space-y-3">
            <div className="flex border border-white/20 focus-within:border-gs-gold transition-colors">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre adresse email"
                required
                className="flex-1 bg-transparent text-xs px-4 py-3 outline-none placeholder:text-white/30 text-white font-light"
              />
              <button type="submit" className="px-4 text-white/50 hover:text-gs-gold transition-colors">
                <FiArrowRight size={16} />
              </button>
            </div>
            <p className="text-white/25 text-xs font-light leading-relaxed">
              Nous ne spammerons pas votre boite mail.
            </p>
          </form>
        </motion.div>

      </div>

      <div className="border-t border-white/10 px-6 md:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="text-white/30 text-xs font-light"
        >
          Copyright 2025 GoShop. Tous les droits sont reserves.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-3"
        >
          {payments.map((pay) => (
            <span
              key={pay}
              className="border border-white/20 text-white/40 text-xs tracking-widest px-3 py-1.5 rounded font-light"
            >
              {pay}
            </span>
          ))}
        </motion.div>
      </div>

    </footer>
  );
};

export default Footer;