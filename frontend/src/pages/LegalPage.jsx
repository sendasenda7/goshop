import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const content = {
  '/mentions-legales': {
    title: 'Mentions Légales',
    sections: [
      {
        heading: 'Éditeur du site',
        body: "GoShop est un site de vente en ligne édité en Tunisie. Pour toute question relative à l'édition du site, contactez-nous via la page Contact.",
      },
      {
        heading: 'Hébergement',
        body: "Le site est hébergé par un prestataire tiers garantissant la disponibilité et la sécurité des données hébergées.",
      },
      {
        heading: 'Propriété intellectuelle',
        body: "L'ensemble des contenus présents sur GoShop (textes, images, logos) est protégé par le droit d'auteur. Toute reproduction sans autorisation est interdite.",
      },
    ],
  },
  '/confidentialite': {
    title: 'Politique de Confidentialité',
    sections: [
      {
        heading: 'Données collectées',
        body: "Nous collectons uniquement les informations nécessaires au traitement de votre commande : nom, adresse, email et numéro de téléphone.",
      },
      {
        heading: 'Utilisation des données',
        body: "Vos données servent exclusivement à la gestion de vos commandes et à l'amélioration de votre expérience sur le site. Elles ne sont jamais revendues à des tiers.",
      },
      {
        heading: 'Vos droits',
        body: "Conformément à la réglementation en vigueur, vous pouvez à tout moment demander l'accès, la modification ou la suppression de vos données personnelles depuis votre espace \"Mon Compte\" ou en nous contactant.",
      },
    ],
  },
};

const LegalPage = () => {
  const { pathname } = useLocation();
  const page = content[pathname] || content['/mentions-legales'];

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
          <p className="label-tag text-gs-gold mb-3">Informations</p>
          <h1 className="font-display text-5xl md:text-6xl font-light italic">
            {page.title}
          </h1>
        </motion.div>

        <div className="space-y-10">
          {page.sections.map((section) => (
            <div key={section.heading}>
              <h2 className="font-semibold text-lg mb-2">{section.heading}</h2>
              <p className="text-gs-gray leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LegalPage;
