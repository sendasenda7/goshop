require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connecté\n');

  // Simule exactement ce que getMe renvoie
  const user = await User.findOne({ email: 'sendadenguir@gmail.com' }).select('-password');

  console.log('=== Ce que getMe renvoie à AuthContext ===');
  const response = {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    role: user.role,
    avatar: user.avatar || '',
    addresses: user.addresses || [],
    createdAt: user.createdAt,
  };
  console.log(JSON.stringify(response, null, 2));

  console.log('\n=== URL finale affichée dans le navigateur ===');
  console.log(`http://localhost:5000${response.avatar}`);

  await mongoose.disconnect();
};
run().catch(console.error);