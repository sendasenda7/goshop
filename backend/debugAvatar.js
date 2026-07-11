require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connecté\n');
  const users = await User.find({}).select('name email avatar');
  users.forEach(u => {
    console.log(`Nom   : ${u.name}`);
    console.log(`Email : ${u.email}`);
    console.log(`Avatar: "${u.avatar}"`);
    console.log('-'.repeat(50));
  });
  await mongoose.disconnect();
};
run().catch(console.error);