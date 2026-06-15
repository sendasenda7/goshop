import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiUser, FiShoppingBag, FiHeart, FiX, FiMenu } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
const { cartCount, total } = useCart();
const { user, logout } = useAuth();
const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = ['FEMME', 'HOMME', 'SACS', 'COLLECTIONS', 'NOUVEAUTÉS'];

  return (
    <>
      {/* TOP BAR */}
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-white border-b border-black/10 shadow-sm' : 'bg-white/95'
        }`}
      >
        <div className="flex items-center justify-between px-6 md:px-12 h-16">

          {/* LEFT */}
          <div className="flex items-center gap-6 w-1/3">
            <button onClick={() => setMenuOpen(true)} className="hover:opacity-60 transition-opacity">
              <FiMenu size={20} strokeWidth={1.5} />
            </button>
            <button onClick={() => setSearchOpen(!searchOpen)} className="hover:opacity-60 transition-opacity hidden md:block">
              <FiSearch size={18} strokeWidth={1.5} />
            </button>
          </div>

          {/* CENTER — Logo */}
          <Link to="/" className="w-1/3 flex justify-center">
            <motion.div whileHover={{ opacity: 0.7 }} className="text-center">
              <div className="font-display text-2xl md:text-3xl font-light tracking-[0.15em] uppercase">
                Go<span className="font-semibold">Shop</span>
              </div>
              <div className="text-[9px] tracking-[0.3em] text-gs-gray uppercase font-light -mt-1">
                Maroquinerie
              </div>
            </motion.div>
          </Link>

          {/* RIGHT */}
          <div className="flex items-center justify-end gap-5 w-1/3">
{user ? (
  <div className="hidden md:flex items-center gap-3">
    <Link
      to="/profile"
      className="flex items-center gap-2 hover:opacity-60 transition-opacity"
    >
      <FiUser size={18} strokeWidth={1.5} />
      <span className="text-xs tracking-widest uppercase hidden lg:block">
        {user.name}
      </span>
    </Link>
<button
  onClick={() => { logout(); navigate('/login'); }}
  className="text-xs tracking-widest uppercase text-gs-gray hover:text-red-500 transition-colors hidden lg:block"
>
  Quitter
</button>
  </div>
) : (
  <Link to="/login" className="hidden md:flex items-center gap-2 hover:opacity-60 transition-opacity">
    <FiUser size={18} strokeWidth={1.5} />
    <span className="text-xs tracking-widest uppercase hidden lg:block">
      Mon Compte
    </span>
  </Link>
)}
            <Link to="/wishlist" className="hover:opacity-60 transition-opacity hidden md:block">
              <FiHeart size={18} strokeWidth={1.5} />
            </Link>
<Link to="/cart" className="flex items-center gap-2 hover:opacity-60 transition-opacity relative">
  <FiShoppingBag size={18} strokeWidth={1.5} />
  {cartCount > 0 && (
    <span className="absolute -top-2 -right-2 bg-gs-black text-white text-[9px] font-medium w-4 h-4 rounded-full flex items-center justify-center">
      {cartCount}
    </span>
  )}
  <span className="text-xs tracking-widest uppercase hidden lg:block">{total} TND</span>
</Link>
          </div>
        </div>

        {/* CATEGORIES NAV */}
        <div className="hidden md:flex items-center justify-center gap-10 h-10 border-t border-black/5">
          {navLinks.map((link) => (
            <Link
              key={link}
              to={`/shop?cat=${link.toLowerCase()}`}
              className="text-[11px] tracking-[0.2em] uppercase text-gs-black hover:text-gs-gold transition-colors duration-300 font-light"
            >
              {link}
            </Link>
          ))}
        </div>

        {/* SEARCH BAR */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-black/10 overflow-hidden"
            >
              <div className="flex items-center px-12 py-3">
                <FiSearch size={16} className="text-gs-gray mr-3" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Rechercher un produit..."
                  className="flex-1 text-sm font-light tracking-wide outline-none bg-transparent placeholder:text-gs-gray"
                />
                <button onClick={() => setSearchOpen(false)}>
                  <FiX size={16} className="text-gs-gray hover:text-black transition-colors" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* MOBILE MENU DRAWER */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black/40 z-50"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 left-0 h-full w-80 bg-white z-50 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-black/10">
                <div className="font-display text-2xl font-light tracking-widest">GoShop</div>
                <button onClick={() => setMenuOpen(false)}>
                  <FiX size={22} strokeWidth={1.5} />
                </button>
              </div>

              {/* Links */}
              <nav className="flex-1 px-8 py-10">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.07 }}
                    className="border-b border-black/5"
                  >
                    <Link
                      to={`/shop?cat=${link.toLowerCase()}`}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between py-5 text-sm tracking-[0.2em] uppercase font-light hover:text-gs-gold transition-colors"
                    >
                      {link}
                      <span className="text-gs-gray">→</span>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Bottom */}
              <div className="px-8 py-6 border-t border-black/10 flex gap-6">
                <Link to="/login" className="label-tag hover:text-gs-black transition-colors">Mon Compte</Link>
                <Link to="/wishlist" className="label-tag hover:text-gs-black transition-colors">Wishlist</Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* BOTTOM NAV MOBILE */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-black/10">
        <div className="grid grid-cols-4 py-3">
          {[
            { icon: <FiSearch size={20} strokeWidth={1.5} />, to: '/search', label: 'Chercher' },
            { icon: <FiHeart size={20} strokeWidth={1.5} />, to: '/wishlist', label: 'Wishlist' },
            { icon: <FiUser size={20} strokeWidth={1.5} />, to: '/login', label: 'Compte' },
            { icon: <FiShoppingBag size={20} strokeWidth={1.5} />, to: '/cart', label: 'Panier' },
          ].map((item, i) => (
            <Link key={i} to={item.to} className="flex flex-col items-center gap-1 text-gs-black hover:text-gs-gold transition-colors py-1">
              {item.icon}
              <span className="text-[9px] tracking-widest uppercase">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navbar;