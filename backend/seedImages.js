require('dotenv').config();
require('./config/db')();
const Product = require('./models/Product');

const imageMap = {
  'The Dome': ['https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80'],
  'Neon Noir': ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80'],
  'Monolith': ['https://images.unsplash.com/photo-1473188588951-666fce8e7c68?w=800&q=80'],
  'The Classic': ['https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80'],
  'Urban Brief': ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80'],
  'Mini Luxe': ['https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80'],
  'SS26 Tote': ['https://images.unsplash.com/photo-1523779105320-d1cd346ff52b?w=800&q=80'],
  'Belt GoShop': ['https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&q=80'],
};

const seed = async () => {
  try {
    for (const [name, images] of Object.entries(imageMap)) {
      await Product.updateOne({ name }, { $set: { images } });
      console.log(`✅ ${name} mis à jour`);
    }
    console.log('🎉 Toutes les images ont été seedées !');
    process.exit();
  } catch (err) {
    console.error('❌ Erreur:', err);
    process.exit(1);
  }
};

setTimeout(seed, 1000);