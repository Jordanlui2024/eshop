const mongoose = require('mongoose');
const User = require('./models/user');
const bcrypt = require('bcrypt'); // 確保引入 bcrypt

mongoose.connect('mongodb://localhost:27017/eshop', {
  serverSelectionTimeoutMS: 5000
}).then(async () => {
  console.log('Connected to MongoDB');
  await User.deleteOne({ email: 'aa@qq.com' }); // 刪除現有用戶
  console.log('Existing user deleted');
  return createAdmin();
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// 創建管理員賬戶
async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash('123456', 10);
    const admin = new User({
      name: 'aa',
      email: 'aa@qq.com',
      password: hashedPassword,
      isAdmin: true
    });

    await admin.save();
    console.log('Admin account created');
  } catch (err) {
    console.error('Error creating admin:', err);
  } finally {
    mongoose.connection.close();
  }
}