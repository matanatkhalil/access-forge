import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pg;

// Get the path to the root .env immediately
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the env before creating the pool
// We go up two levels: from /db to /server to /root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;
