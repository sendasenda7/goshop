import Navbar from '../components/layout/Navbar';
import HeroSection from '../components/layout/HeroSection';
import FeaturedDrops from '../components/layout/FeaturedDrops';
import CollectionsSection from '../components/layout/CollectionsSection';
import InstagramBanner from '../components/layout/InstagramBanner';
import Footer from '../components/layout/Footer';

const HomePage = () => {
  return (
    <div className="bg-gs-white min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturedDrops />
      <CollectionsSection />
      <InstagramBanner />
      <Footer />
    </div>
  );
};

export default HomePage;