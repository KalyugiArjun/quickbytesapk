import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/quickbite';
    
    // Attempt connecting to the configured URI with a quick timeout
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`[QuickBite] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (primaryError) {
    console.warn(`[QuickBite] Primary MongoDB connection (${process.env.MONGODB_URI || 'localhost'}) failed: ${primaryError.message}`);
    console.log('[QuickBite] Initializing MongoDB In-Memory Server for seamless local execution...');
    
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();
      
      const conn = await mongoose.connect(memoryUri);
      console.log(`[QuickBite] Embedded In-Memory MongoDB connected at ${memoryUri}`);
      
      // Auto-seed if running on in-memory instance
      const { seedData } = await import('../utils/seeder.js');
      await seedData();
      
      return conn;
    } catch (memError) {
      console.error(`[QuickBite] In-Memory MongoDB failed to initialize: ${memError.message}`);
      throw primaryError;
    }
  }
};

export default connectDB;
