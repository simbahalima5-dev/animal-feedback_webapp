import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

dotenv.config();

export const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI;
    if (!connStr) {
      throw new Error('MONGODB_URI environment variable is missing');
    }
    console.log(`Connecting to MongoDB...`);
    let conn;
    try {
      conn = await mongoose.connect(connStr, {
        serverSelectionTimeoutMS: 5000
      });
    } catch (err: any) {
      if (err.message && err.message.includes('querySrv ECONNREFUSED')) {
        console.log('Retrying with alternative DNS servers...');
        try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch (e) {}
        conn = await mongoose.connect(connStr, {
          serverSelectionTimeoutMS: 5000
        });
      } else {
        throw err;
      }
    }
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host} (Database: ${conn.connection.name})`);
    return true;
  } catch (error: any) {
    console.warn(`⚠️ MongoDB Connection Error (${error.message}).`);
    return false;
  }
};
