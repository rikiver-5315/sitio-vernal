import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createClient } from 'redis';
import dotenv from 'dotenv';
import { analyzeCase } from './utils/ai.js';
import { generateFingerprint } from './utils/fingerprint.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://rikiver-5315.github.io/sitio-vernal';

// Redis client setup
let redis;
try {
  redis = createClient({ url: process.env.REDIS_URL });
  redis.on('error', (err) => console.log('Redis client error', err));
  await redis.connect();
  console.log('✓ Redis connected');
} catch (err) {
  console.log('⚠ Redis unavailable, running in offline mode');
  redis = null;
}

// Seguridad y confianza en proxy (Render está detrás de un proxy → req.ip real)
app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(helmet());

// Middleware
app.use(express.json({ limit: '16kb' })); // techo de tamaño de body
app.use(cors({
  origin: FRONTEND_URL,
  methods: ['GET', 'POST'],
  credentials: false
}));

// Rate limit por IP (defensa en capas — funciona SIN Redis).
// Frena el abuso económico del endpoint de IA (VULN-01).
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,       // 1 minuto
  max: 5,                    // 5 solicitudes por IP por minuto
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas solicitudes. Esperá un minuto e intentá de nuevo.' }
});
app.use('/api/', apiLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rate limit check
async function checkRateLimit(fingerprint) {
  if (!redis) return { allowed: true, alreadyUsed: false };

  const key = `analysis:${fingerprint}`;
  const exists = await redis.exists(key);

  if (exists) {
    return { allowed: false, alreadyUsed: true };
  }

  await redis.setEx(key, 86400, '1'); // 24 hours
  return { allowed: true, alreadyUsed: false };
}

// Analysis endpoint
app.post('/api/analyze-case', async (req, res) => {
  try {
    const { facts } = req.body;

    // Validate input
    if (!facts || typeof facts !== 'string') {
      return res.status(400).json({ error: 'Invalid facts parameter' });
    }

    if (facts.length < 80 || facts.length > 1500) {
      return res.status(400).json({ error: 'Facts must be between 80 and 1500 characters' });
    }

    // Check rate limit
    const fingerprint = generateFingerprint(req);
    const { allowed, alreadyUsed } = await checkRateLimit(fingerprint);

    if (!allowed) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: 'Ya utilizaste tu análisis en las últimas 24 horas. Intenta mañana.',
        alreadyUsed
      });
    }

    // Analyze case
    const analysis = await analyzeCase(facts);

    // Return HTML
    res.json({
      success: true,
      html: analysis.html,
      data: analysis.data
    });

  } catch (error) {
    // El detalle queda SOLO en los logs de Render, nunca se filtra al cliente
    console.error('Error analyzing case:', error);
    res.status(500).json({
      error: 'Analysis failed',
      message: 'No pudimos procesar tu análisis. Intenta de nuevo en unos minutos.'
    });
  }
});

// Check analysis status
app.get('/api/check-analysis-status', async (req, res) => {
  try {
    const fingerprint = generateFingerprint(req);

    if (!redis) {
      return res.json({ alreadyUsed: false });
    }

    const key = `analysis:${fingerprint}`;
    const exists = await redis.exists(key);

    res.json({ alreadyUsed: !!exists });
  } catch (error) {
    console.error('Error checking status:', error);
    res.status(500).json({ error: 'Check failed' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ CORS enabled for: ${FRONTEND_URL}`);
});
