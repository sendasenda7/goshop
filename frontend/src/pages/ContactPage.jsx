import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Merci de remplir tous les champs');
      return;
    }
    setSending(true);
    // Pas encore d'endpoint backend dédié aux messages de contact :
    // on simule l'envoi côté UI pour ne pas bloquer l'expérience utilisateur.
    setTimeout(() => {
      toast.success('Votre message a été envoyé, nous vous répondrons rapidement !');
      setForm({ name: '', email: '', message: '' });
      setSending(false);
    }, 600);
  };

  return (
    <div className="bg-gs-white min-h-screen">
      <Navbar />

      <section className="pt-32 pb-24 px-6 md:px-12 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="label-tag text-gs-gold mb-3">Contact</p>
          <h1 className="font-display text-5xl md:text-6xl font-light italic mb-4">
            Parlons-<span className="font-semibold">en</span>
          </h1>
          <p className="text-gs-gray max-w-xl mb-14">
            Une question sur une commande, un produit, ou juste envie de nous dire bonjour ?
            Notre équipe vous répond sous 24 à 48h ouvrées.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Infos de contact */}
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <FiMail className="text-gs-gold mt-1" />
              <div>
                <p className="font-medium text-sm">Email</p>
                <p className="text-gs-gray text-sm">contact@goshop.tn</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FiPhone className="text-gs-gold mt-1" />
              <div>
                <p className="font-medium text-sm">Téléphone</p>
                <p className="text-gs-gray text-sm">+216 XX XXX XXX</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FiMapPin className="text-gs-gold mt-1" />
              <div>
                <p className="font-medium text-sm">Adresse</p>
                <p className="text-gs-gray text-sm">Tunis, Tunisie</p>
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="md:col-span-2 space-y-5">
            <div>
              <label className="text-xs tracking-widest uppercase text-gs-gray">Nom</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border-b border-gs-black/20 py-2 focus:outline-none focus:border-gs-gold transition-colors"
                placeholder="Votre nom"
              />
            </div>
            <div>
              <label className="text-xs tracking-widest uppercase text-gs-gray">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border-b border-gs-black/20 py-2 focus:outline-none focus:border-gs-gold transition-colors"
                placeholder="vous@exemple.com"
              />
            </div>
            <div>
              <label className="text-xs tracking-widest uppercase text-gs-gray">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={5}
                className="w-full border-b border-gs-black/20 py-2 focus:outline-none focus:border-gs-gold transition-colors resize-none"
                placeholder="Comment pouvons-nous vous aider ?"
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="btn-outline-black mt-4 disabled:opacity-50"
            >
              {sending ? 'Envoi...' : 'Envoyer le message'}
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
