const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');

dotenv.config();

const products = [
  {
    name: 'The Dome',
    description: 'Le sac iconique de la maison GoShop. Confectionne en cuir pebble de haute qualite.',
    price: 380,
    oldPrice: 450,
    category: 'Femme',
    brand: 'GoShop',
    images: [],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['beige', 'noir', 'vert'],
    stock: 12,
    isFeatured: true,
    isNew: true,
    isSale: true,
  },
  {
    name: 'Neon Noir',
    description: 'Sac en cuir grainé noir mat, finitions dorees.',
    price: 450,
    oldPrice: 0,
    category: 'Femme',
    brand: 'GoShop',
    images: [],
    sizes: ['S', 'M', 'L'],
    colors: ['noir'],
    stock: 5,
    isFeatured: true,
    isNew: false,
    isSale: false,
  },
  {
    name: 'Monolith',
    description: 'Pochette minimaliste en cuir lisse taupe.',
    price: 320,
    oldPrice: 400,
    category: 'Homme',
    brand: 'GoShop',
    images: [],
    sizes: ['M', 'L'],
    colors: ['taupe', 'noir'],
    stock: 8,
    isFeatured: false,
    isNew: false,
    isSale: true,
  },
  {
    name: 'The Classic',
    description: 'Sac classique en cuir souple rose poudre.',
    price: 290,
    oldPrice: 0,
    category: 'Femme',
    brand: 'GoShop',
    images: [],
    sizes: ['XS', 'S', 'M'],
    colors: ['rose', 'beige'],
    stock: 18,
    isFeatured: true,
    isNew: true,
    isSale: false,
  },
  {
    name: 'Urban Brief',
    description: 'Sacoche homme en cuir grainé noir.',
    price: 350,
    oldPrice: 0,
    category: 'Homme',
    brand: 'GoShop',
    images: [],
    sizes: ['M', 'L'],
    colors: ['noir', 'marron'],
    stock: 8,
    isFeatured: false,
    isNew: false,
    isSale: false,
  },
  {
    name: 'Mini Luxe',
    description: 'Mini sac cadeau en cuir colore.',
    price: 190,
    oldPrice: 250,
    category: 'Cadeaux',
    brand: 'GoShop',
    images: [],
    sizes: ['XS', 'S'],
    colors: ['rouge', 'beige'],
    stock: 15,
    isFeatured: false,
    isNew: false,
    isSale: true,
  },
  {
    name: 'SS26 Tote',
    description: 'Tote bag de la nouvelle collection printemps-ete 2026.',
    price: 420,
    oldPrice: 0,
    category: 'Collections',
    brand: 'GoShop',
    images: [],
    sizes: ['M', 'L'],
    colors: ['vert', 'creme'],
    stock: 6,
    isFeatured: true,
    isNew: true,
    isSale: false,
  },
  {
    name: 'Belt GoShop',
    description: 'Ceinture en cuir avec boucle doree.',
    price: 150,
    oldPrice: 0,
    category: 'Homme',
    brand: 'GoShop',
    images: [],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['noir'],
    stock: 20,
    isFeatured: false,
    isNew: false,
    isSale: false,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    await Product.deleteMany();
    console.log('Products cleared');

    await Product.insertMany(products);
    console.log('Products seeded successfully !');

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();