// =========================================================================
// PRODUCTION-GRADE EXPRESS APPLICATION ENTRY POINT
// =========================================================================

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

import { config } from './config.js';
import { authRouter } from './routes/authRoutes.js';
import { productRouter } from './routes/productRoutes.js';
import { vendorRouter } from './routes/vendorRoutes.js';
import { orderRouter } from './routes/orderRoutes.js';
import { aiRouter } from './routes/aiRoutes.js';
import { adminRouter } from './routes/adminRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Allows flexible media delivery in demo
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration
app.use(cors({
  origin: true,
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Allow generous limits for live demo testing
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use(limiter);

// Body parser
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Fresh Flower Marketplace API',
    ai_enabled: Boolean(config.geminiApiKey),
    model: config.geminiModel,
    supabase_configured: Boolean(config.supabaseUrl && config.supabaseKey),
  });
});

// Live Supabase Health & Connection Check
app.get('/api/health/supabase', async (_req: Request, res: Response) => {
  const { testSupabaseConnection } = await import('./db/supabaseClient.js');
  const result = await testSupabaseConnection();
  res.json(result);
});

// Trigger Supabase Seed Sync
app.post('/api/supabase/sync', async (_req: Request, res: Response) => {
  const { syncSeedToSupabase } = await import('./db/supabaseClient.js');
  const result = await syncSeedToSupabase();
  res.json(result);
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/vendors', vendorRouter);
app.use('/api/orders', orderRouter);
app.use('/api/ai', aiRouter);
app.use('/api/admin', adminRouter);

// Serve client in production if built
const clientDistPath = path.resolve(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req: Request, res: Response, next: NextFunction) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      next();
    }
  });
});

// Global 404 handler for unmatched API routes
app.use('/api/*', (req: Request, res: Response) => {
  res.status(404).json({ error: `Endpoint ${req.originalUrl} not found` });
});

// Global error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[ServerError]', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(config.nodeEnv === 'development' ? { stack: err.stack } : {}),
  });
});

app.listen(config.port, () => {
  console.log(`=======================================================`);
  console.log(`🌸 FRESH FLOWER PLATFORM SERVER RUNNING ON PORT ${config.port}`);
  console.log(`   Health Check: http://localhost:${config.port}/api/health`);
  console.log(`   AI Engine: @google/genai (${config.geminiModel})`);
  console.log(`=======================================================`);
});

export default app;
