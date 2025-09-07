// Load environment variables first
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Get directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure environment variables. On Render, variables come from the environment,
// so absence of a local .env file should not be fatal.
const envResult = config();
if (envResult.error) {
  console.warn('No local .env file found. Falling back to process environment.');
}
console.log('GOOGLE_API_KEY present:', Boolean(process.env.GOOGLE_API_KEY));

// Now import other dependencies
import express from 'express';
import cors from 'cors';
import { testConnection } from './db/index.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
import resumeRoutes from './routes/resumeRoutes.js';
app.use('/api/resumes', resumeRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const dbStatus = (await testConnection()) ? 'connected' : 'disconnected';
  res.json({
    status: 'ok',
    message: 'Server is running',
    database: dbStatus,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Debug endpoint to check environment variables (temporary)
app.get('/api/debug/env', (req, res) => {
  const envVars = {
    NODE_ENV: process.env.NODE_ENV,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY
      ? `${process.env.GOOGLE_API_KEY.substring(0, 8)}...`
      : 'Not set',
    DB_USER: process.env.DB_USER,
    DB_HOST: process.env.DB_HOST,
    DB_DATABASE: process.env.DB_DATABASE,
    DB_PORT: process.env.DB_PORT,
    // Don't log sensitive data
  };

  res.json({
    status: 'debug',
    environment: process.env.NODE_ENV || 'development',
    envVars,
    timestamp: new Date().toISOString(),
  });
});

// Debug endpoint to list available models
app.get('/api/debug/models', async (req, res) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
    genAI.getGenerativeModel({ model: 'gemini-pro' });

    // This is a workaround since listModels might not be directly available
    res.json({
      status: 'success',
      message: 'Try using model: gemini-pro or models/gemini-pro',
      suggestedModels: [
        'gemini-pro',
        'models/gemini-pro',
        'gemini-1.5-pro',
        'models/gemini-1.5-pro',
      ],
    });
  } catch (error) {
    console.error('Error listing models:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to list models',
      error: error.message,
    });
  }
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res) => {
  console.error('Error:', err.stack);

  // Handle multer file size limit error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      error: 'File too large. Maximum size is 5MB.',
    });
  }

  // Handle other errors
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!',
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  // Close server & exit process
  // server.close(() => process.exit(1));
});

// Start server
const server = app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  try {
    const isConnected = await testConnection();
    console.log(`Database connection: ${isConnected ? '✅ Connected' : '❌ Disconnected'}`);
  } catch (error) {
    console.error('Database connection error:', error.message);
  }
});

// Handle server errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(
      `❌ Port ${PORT} is already in use. Please try a different port or stop the process using this port.`
    );
    console.log(
      `💡 You can change the port in your .env file or use: netstat -ano | findstr :${PORT} to find the process using this port.`
    );
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});
