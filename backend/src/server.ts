import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bookRoutes from './routes/bookRoutes';
import chatRoutes from './routes/chatRoutes';
import featureRoutes from './routes/featureRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { testBobConnection } from './config/llm';
import { corsOptions } from './config/cors';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

// In-memory storage for books (shared across controllers)
const books = new Map();
app.locals.books = books;

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/books', bookRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api', featureRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Initialize services and start server
const startServer = async () => {
  try {
    console.log('🚀 Starting Book AI Server...\n');

    // Test Bob API connection
    console.log('🔌 Testing Bob API connection...');
    const bobConnected = await testBobConnection();
    if (!bobConnected) {
      console.warn('⚠️  Warning: Bob API connection failed. Check your API key.');
    }

    // Using Simple Vector Store (no ChromaDB initialization needed)
    console.log('💾 Using Simple Vector Store (JSON-based)...');

    // Start server - bind to 0.0.0.0 for Railway/cloud deployment
    app.listen(PORT, '0.0.0.0', () => {
      console.log('\n✅ Server started successfully!\n');
      console.log(`📍 Server running on port: ${PORT}`);
      console.log(`🏥 Health check: /health`);
      console.log(`📚 Books API: /api/books`);
      console.log(`💬 Chat API: /api/chat`);
      console.log('\n📖 Ready to process books!\n');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n👋 SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n👋 SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// Start the server
startServer();

// Made with Bob
