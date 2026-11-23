import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';

// Load routes
import authRoutes from './routes/authRoutes.js';
import restaurantRoutes from './routes/restaurantRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable dynamic CORS for Vercel, localhost, Capacitor and previews
app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (e.g. mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    // allow Vercel domains, localhost, private LAN, or configured CLIENT_URL
    if (
      origin.includes('vercel.app') ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      origin.includes('192.168.') ||
      origin === process.env.CLIENT_URL
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Logger in dev
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serve uploaded static files
const uploadsPath = path.resolve('uploads');
app.use('/uploads', express.static(uploadsPath));

// Root info route for Render
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    app: 'QuickBite Food Ordering API',
    tagline: 'Khaao Pio Moj Karo',
    health: '/api/health',
    timestamp: new Date().toISOString()
  });
});

// API health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    app: 'QuickBite Food Ordering API',
    tagline: 'Khaao Pio Moj Karo',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/upload', uploadRoutes);

// Centralized error handler
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`\n======================================================`);
      console.log(`🍕 QuickBite API Server is running on port ${PORT}`);
      console.log(`✨ Tagline: Khaao Pio Moj Karo`);
      console.log(`🌐 Base URL: http://0.0.0.0:${PORT}`);
      console.log(`🔗 Health Check: http://0.0.0.0:${PORT}/api/health`);
      console.log(`======================================================\n`);
    });
  } catch (err) {
    console.error('Failed to start QuickBite server:', err);
    process.exit(1);
  }
};

startServer();
