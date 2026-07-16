import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const faqs = [
  {
    q: 'Quels sont les délais de livraison ?',
    a: "Les commandes sont livrées sous 2 à 4 jours ouvrés partout en Tunisie. Un email de confirmation avec le suivi vous est envoyé dès l'expédition.",
  },
  {
    q: 'Comment suivre ma commande ?',
    a: 'Rendez-vous dans votre espace "Mon Compte" > "Mes Commandes" pour voir le statut en temps réel de chaque commande.',
  },
  {
    q: 'Puis-je retourner un article ?',
    a: "Oui, vous disposez de 14 jours après réception pour retourner un article non porté et dans son emballage d'origine. Contactez-nous depuis la page Contact pour lancer la procédure.",
  },
  {
    q: 'Quels moyens de paiement acceptez-vous ?',
    a: 'Nous acceptons le paiement à la livraison ainsi que les principales cartes bancaires tunisiennes et internationales.',
  },
  {
    q: 'Comment contacter le service client ?',
    a: 'Notre équipe est disponible via la page Contact, par email à contact@goshop.tn, ou par téléphone du lundi au vendredi.',
  },
];

const FaqItem = ({ item, isOpen, onClick }) => (
  <div className="border-b border-gs-black/10">
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between py-6 text-left"
      aria-expanded={isOpen}
    >
      <span className="font-medium text-lg pr-4">{item.q}</span>
      <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
        <FiChevronDown className="text-gs-gold flex-shrink-0" size={20} />
      </motion.span>
    </button>
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <p className="text-gs-gray pb-6 pr-8 leading-relaxed">{item.a}</p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const FaqPage = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="bg-gs-white min-h-screen">
      <Navbar />

      <section className="pt-32 pb-24 px-6 md:px-12 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p className="label-tag text-gs-gold mb-3">Aide</p>
          <h1 className="font-display text-5xl md:text-6xl font-light italic">
            Questions <span className="font-semibold">Fréquentes</span>
          </h1>
        </motion.div>

        <div>
          {faqs.map((item, i) => (
            <FaqItem
              key={item.q}
              item={item}
              isOpen={openIndex === i}
              onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FaqPage;
