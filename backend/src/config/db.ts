import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

dotenv.config();

// Ensure Google / Cloudflare public DNS servers are used for reliable SRV lookup
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

export const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI;
    if (!connStr) {
      console.warn('⚠️ MONGODB_URI environment variable is missing.');
      return false;
    }
    console.log(`Connecting to MongoDB Atlas...`);
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host} (Database: ${conn.connection.name})`);
    return true;
  } catch (error: any) {
    console.warn(`⚠️ MongoDB Connection Error (${error.message}). Running in fallback mode.`);
    return false;
  }
};

