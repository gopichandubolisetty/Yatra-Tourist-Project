const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const raw = (process.env.MONGODB_URI || '').trim();
    const isPlaceholder =
      !raw ||
      raw.includes('USERNAME:PASSWORD') ||
      raw.includes('cluster.mongodb.net/yatra') ||
      raw.includes('_mongodb._tcp.cluster.mongodb.net');

    const uri = isPlaceholder ? 'mongodb://127.0.0.1:27017/yatra' : raw;

    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;

