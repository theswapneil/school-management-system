const mongoose = require('mongoose');

const dns = require('dns');
dns.setServers(["1.1.1.1"]); // Use Cloudflare DNS

require('dotenv').config();

const connectDB = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    console.log('📍 Connection URI:', process.env.MONGODB_URI.replace(/:[^:]*@/, ':***@')); // Hide password
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB connected successfully');
    return mongoose.connection;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

