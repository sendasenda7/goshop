// debugOrders.js
// Script de diagnostic : liste toutes les commandes avec leurs champs critiques
// pour identifier pourquoi une commande annulée apparaît encore dans les stats.
//
// Usage : node debugOrders.js

require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('./models/Order');

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connecté à MongoDB\n');

    const orders = await Order.find({}).sort({ createdAt: -1 });

    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Lundi
    startOfWeek.setHours(0, 0, 0, 0);

    console.log(`Date système actuelle : ${now}`);
    console.log(`Début de semaine calculé (Lundi) : ${startOfWeek}\n`);

    if (orders.length === 0) {
      console.log('Aucune commande trouvée en base.');
    }

    console.log(`${orders.length} commande(s) trouvée(s) :\n`);
    console.log('='.repeat(100));

    orders.forEach((o, i) => {
      console.log(`#${i + 1} — ID: ${o._id}`);
      console.log(`   createdAt     : ${o.createdAt}`);
      console.log(`   totalPrice    : ${o.totalPrice}`);
      console.log(`   orderStatus   : "${o.orderStatus}"  (type: ${typeof o.orderStatus})`);
      console.log(`   paymentStatus : "${o.paymentStatus}"  (type: ${typeof o.paymentStatus})`);
      console.log(`   paymentMethod : "${o.paymentMethod}"`);
      console.log(`   isCancelledMatch (orderStatus === 'cancelled') : ${o.orderStatus === 'cancelled'}`);
      console.log(`   isPaidMatch (paymentStatus === 'paid')         : ${o.paymentStatus === 'paid'}`);
      console.log(`   isInThisWeek (createdAt >= startOfWeek)        : ${o.createdAt >= startOfWeek}`);
      console.log('-'.repeat(100));
    });

    await mongoose.disconnect();
  } catch (err) {
    console.error('Erreur :', err.message);
    process.exit(1);
  }
};

run();