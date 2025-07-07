import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../src/models/User.js';
import dotenv from 'dotenv';

dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);

  const existingAdmin = await User.findOne({ role: 'admin' });
  if (existingAdmin) {
    console.log('Admin user already exists.');
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash('adminpassword123', 10);

  const adminUser = new User({
    email: 'admin@example.com',
    password: passwordHash,
    role: 'admin',
    isActive: true,
  });

  await adminUser.save();

  console.log('Admin user created with email: admin@example.com and password: adminpassword123');
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});