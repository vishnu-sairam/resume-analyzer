import pg from 'pg';
import { fileURLToPath } from 'url';
import path from 'path';
import { promises as fs } from 'fs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database configuration
const pool = new pg.Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: 'postgres', // Connect to default postgres database
  password: process.env.DB_PASSWORD || 'Vishnu@123',
  port: parseInt(process.env.DB_PORT) || 5432,
});

async function resetDatabase() {
  const client = await pool.connect();

  try {
    console.log('Dropping existing database...');
    await client.query('DROP DATABASE IF EXISTS resume_analyzer');
    console.log('Creating new database...');
    await client.query('CREATE DATABASE resume_analyzer');
    console.log('Database reset successfully!');
  } catch (error) {
    console.error('Error resetting database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

resetDatabase()
  .then(() => {
    console.log('Database reset completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to reset database:', error);
    process.exit(1);
  });
