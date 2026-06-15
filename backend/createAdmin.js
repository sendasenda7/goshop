const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, lowercase: true },
  password: { type: String, select: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  avatar: { type: String, default: '' },
  phone: { type: String, default: '' },
  addresses: [],
  wishlist: [],
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const existing = await User.findOne({ email: 'admin@goshop.tn' });
  if (existing) {
    // Met à jour le role en admin si l'user existe déjà
    await User.updateOne({ email: 'admin@goshop.tn' }, { role: 'admin' });
    console.log('✅ Compte admin@goshop.tn mis à jour en role admin');
  } else {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash('Admin@123', salt);
    await User.create({
      name: 'Admin',
      email: 'admin@goshop.tn',
      password: hashed,
      role: 'admin',
    });
    console.log('✅ Compte admin créé !');
    console.log('   Email    : admin@goshop.tn');
    console.log('   Password : Admin@123');
  }
  
  await mongoose.disconnect();
}

createAdmin().catch(console.error);