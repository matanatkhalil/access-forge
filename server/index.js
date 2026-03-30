import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

// Create the ESM equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Point to the root .env (one folder up from /server)
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import pool from './db/db.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health Check Route
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Access Forge Server is healthy',
    environment: process.env.NODE_ENV,
  });
});

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);

  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Database Connected:', res.rows[0].now);
  } catch (error) {
    console.error('Database connection error:', error.message);
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('Dev Mode: Detailed logging enabled');
  } else {
    console.log('Production Mode: Performance optimized');
  }
});
