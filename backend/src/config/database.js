const { MongoClient, ServerApiVersion } = require('mongodb');

const dns = require('dns');
dns.setServers(["1.1.1.1"]); // Use Cloudflare DNS

require('dotenv').config();
 const mongoose = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
const connectDB = async () => {
  try {
        console.log('MongoDB start connection...', process.env.MONGODB_URI);
        await mongoose.connect();
        console.log('MongoDB connected successfully');
  } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
  }
};

module.exports = connectDB;
