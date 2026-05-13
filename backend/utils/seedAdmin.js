import User from '../models/User.js';

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (!adminExists) {
      await User.create({
        email: process.env.ADMIN_EMAIL || 'admin@vinayakhomedecor.com',
        password: process.env.ADMIN_PASSWORD || 'admin123',
        role: 'admin',
      });
      console.log('Admin user created');
    }
  } catch (error) {
    console.error('Error seeding admin:', error.message);
  }
};

export default seedAdmin;
