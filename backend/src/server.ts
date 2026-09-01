import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import animalRoutes from './routes/animalRoutes';
import commentRoutes from './routes/commentRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static public animal images
app.use('/images', express.static(path.join(__dirname, '../../public/images')));

// Connect to MongoDB Atlas
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/animals', animalRoutes);
app.use('/api', commentRoutes);

// Root Route - Welcome & API Status
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'FaunaPulse Express API is running',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      animals: '/api/animals',
      comments: '/api/animals/:id/comments'
    },
    timestamp: new Date().toISOString()
  });
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'FaunaPulse Express API',
    database: 'MongoDB Atlas',
    mediaStorage: 'Cloudinary',
    timestamp: new Date().toISOString()
  });
});

// 404 Handler for Undefined Routes
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    availableEndpoints: ['/', '/api/health', '/api/auth', '/api/animals']
  });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 Express API server running on http://127.0.0.1:${PORT}`);
  console.log(`📡 Endpoints: / | /api/health | /api/auth | /api/animals`);
});

export default app;
