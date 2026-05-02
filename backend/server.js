import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './db/init.js';
import { initializeWatsonX, isIBMConfigured } from './services/ibmService.js';
import uploadRoutes from './routes/upload.js';
import pipelineRoutes from './routes/pipeline.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Data-Synth Backend is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api', uploadRoutes);
app.use('/api', pipelineRoutes);

// Initialize database and start server
async function startServer() {
  try {
    // Initialize database
    await initializeDatabase();
    console.log('✅ Database initialized successfully');
    
    // Initialize IBM watsonx.ai
    await initializeWatsonX();
    if (isIBMConfigured()) {
      console.log('✅ IBM watsonx.ai configured');
    } else {
      console.log('⚠️  Running in mock mode (IBM credentials not configured)');
    }
    
    app.listen(PORT, () => {
      console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

// Made with Bob
