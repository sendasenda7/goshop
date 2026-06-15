import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const AuthPage = () => {
  const { login, register } = useAuth();

  const [mode, setMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', confirm: '' });

const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    await login(loginData.email, loginData.password);
    navigate('/');
  } catch (err) {
    alert(err.response?.data?.message || 'Erreur de connexion');
  } finally {
    setLoading(false);
  }
};


const handleRegister = async (e) => {
  e.preventDefault();
  if (registerData.password !== registerData.confirm) {
    alert('Les mots de passe ne correspondent pas');
    return;
  }
  setLoading(true);
  try {
    await register(registerData.name, registerData.email, registerData.password);
    navigate('/');
  } catch (err) {
    alert(err.response?.data?.message || 'Erreur inscription');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gs-white flex">

      {/* LEFT — Visual */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden md:flex flex-col w-1/2 bg-gs-black relative overflow-hidden"
      >
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Floating blobs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-20 right-20 w-64 h-64 rounded-full bg-gs-gold/20 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-20 left-20 w-48 h-48 rounded-full bg-white/10 blur-3xl"
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-12">
          {/* Logo */}
          <Link to="/">
            <div className="font-display text-3xl font-light tracking-widest text-white mb-auto">
              Go<span className="font-semibold">Shop</span>
            </div>
          </Link>

          {/* Center */}
          <div className="my-auto">
            <motion.div
              animate={{ y: [0, -15, 0], rotate: [-2, 2, -2] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              className="text-center mb-12"
            >
              <div className="text-9xl mb-6">👜</div>
              <div className="w-32 h-px bg-gs-gold mx-auto mb-6" />
            </motion.div>

            <h2 className="font-display text-5xl font-light italic text-white mb-4">
              L'art du
              <br />
              <span className="font-semibold">Cuir Veritable</span>
            </h2>
            <p className="text-white/40 text-sm font-light leading-relaxed max-w-xs">
              Rejoignez la communaute GoShop et decouvrez nos pieces exclusives.
            </p>
          </div>

          {/* Bottom */}
          <div className="mt-auto">
            <p className="text-white/20 text-xs font-light tracking-widest">
              MAROQUINERIE DE LUXE DEPUIS 1986
            </p>
          </div>
        </div>
      </motion.div>

      {/* RIGHT — Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="md:hidden text-center mb-10">
            <Link to="/">
              <div className="font-display text-3xl font-light tracking-widest">
                Go<span className="font-semibold">Shop</span>
              </div>
            </Link>
          </div>

          {/* Toggle */}
          <div className="flex mb-10 border-b border-black/10">
            {['login', 'register'].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 pb-4 text-xs tracking-widest uppercase relative transition-colors ${
                  mode === m ? 'text-gs-black' : 'text-gs-gray hover:text-gs-black'
                }`}
              >
                {m === 'login' ? 'Connexion' : 'Inscription'}
                {mode === m && (
                  <motion.div
                    layoutId="authTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gs-black"
                  />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">

            {/* LOGIN FORM */}
            {mode === 'login' && (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleLogin}
                className="space-y-5"
              >
                <div>
                  <label className="label-tag mb-2 block">Email</label>
                  <div className="flex items-center border border-black/20 focus-within:border-gs-black transition-colors">
                    <FiMail size={14} className="ml-4 text-gs-gray" />
                    <input
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      placeholder="votre@email.com"
                      required
                      className="flex-1 px-3 py-4 text-sm outline-none bg-transparent placeholder:text-gs-gray font-light"
                    />
                  </div>
                </div>

                <div>
                  <label className="label-tag mb-2 block">Mot de passe</label>
                  <div className="flex items-center border border-black/20 focus-within:border-gs-black transition-colors">
                    <FiLock size={14} className="ml-4 text-gs-gray" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      placeholder="••••••••"
                      required
                      className="flex-1 px-3 py-4 text-sm outline-none bg-transparent placeholder:text-gs-gray font-light"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="mr-4 text-gs-gray hover:text-gs-black transition-colors"
                    >
                      {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="accent-gs-black" />
                    <span className="text-xs text-gs-gray font-light">Se souvenir de moi</span>
                  </label>
                  <button type="button" className="text-xs text-gs-gold hover:underline font-light">
                    Mot de passe oublie ?
                  </button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={loading}
                  className="w-full btn-gold flex items-center justify-center gap-3 mt-2"
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      Se Connecter
                      <FiArrowRight size={14} />
                    </>
                  )}
                </motion.button>

                <p className="text-center text-xs text-gs-gray font-light">
                  Pas encore de compte ?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('register')}
                    className="text-gs-black font-medium hover:text-gs-gold transition-colors"
                  >
                    S'inscrire
                  </button>
                </p>
              </motion.form>
            )}

            {/* REGISTER FORM */}
            {mode === 'register' && (
              <motion.form
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleRegister}
                className="space-y-5"
              >
                <div>
                  <label className="label-tag mb-2 block">Nom complet</label>
                  <div className="flex items-center border border-black/20 focus-within:border-gs-black transition-colors">
                    <FiUser size={14} className="ml-4 text-gs-gray" />
                    <input
                      type="text"
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      placeholder="Votre nom"
                      required
                      className="flex-1 px-3 py-4 text-sm outline-none bg-transparent placeholder:text-gs-gray font-light"
                    />
                  </div>
                </div>

                <div>
                  <label className="label-tag mb-2 block">Email</label>
                  <div className="flex items-center border border-black/20 focus-within:border-gs-black transition-colors">
                    <FiMail size={14} className="ml-4 text-gs-gray" />
                    <input
                      type="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      placeholder="votre@email.com"
                      required
                      className="flex-1 px-3 py-4 text-sm outline-none bg-transparent placeholder:text-gs-gray font-light"
                    />
                  </div>
                </div>

                <div>
                  <label className="label-tag mb-2 block">Mot de passe</label>
                  <div className="flex items-center border border-black/20 focus-within:border-gs-black transition-colors">
                    <FiLock size={14} className="ml-4 text-gs-gray" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      placeholder="••••••••"
                      required
                      className="flex-1 px-3 py-4 text-sm outline-none bg-transparent placeholder:text-gs-gray font-light"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="mr-4 text-gs-gray hover:text-gs-black transition-colors"
                    >
                      {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="label-tag mb-2 block">Confirmer le mot de passe</label>
                  <div className="flex items-center border border-black/20 focus-within:border-gs-black transition-colors">
                    <FiLock size={14} className="ml-4 text-gs-gray" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={registerData.confirm}
                      onChange={(e) => setRegisterData({ ...registerData, confirm: e.target.value })}
                      placeholder="••••••••"
                      required
                      className="flex-1 px-3 py-4 text-sm outline-none bg-transparent placeholder:text-gs-gray font-light"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={loading}
                  className="w-full btn-gold flex items-center justify-center gap-3 mt-2"
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      Creer mon compte
                      <FiArrowRight size={14} />
                    </>
                  )}
                </motion.button>

                <p className="text-center text-xs text-gs-gray font-light">
                  Deja un compte ?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-gs-black font-medium hover:text-gs-gold transition-colors"
                  >
                    Se connecter
                  </button>
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;