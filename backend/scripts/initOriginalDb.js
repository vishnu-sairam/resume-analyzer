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
  database: process.env.DB_DATABASE || 'resume_analyzer',
  password: process.env.DB_PASSWORD || 'Vishnu@123',
  port: parseInt(process.env.DB_PORT) || 5432,
});

async function initDatabase() {
  const client = await pool.connect();

  try {
    console.log('Initializing database with original schema...');

    // Read the init.sql file
    const schemaPath = path.join(__dirname, '../db/init.sql');
    const schemaSql = await fs.readFile(schemaPath, 'utf8');

    // Execute the schema SQL
    await client.query(schemaSql);

    console.log('Database initialized successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

initDatabase()
  .then(() => {
    console.log('Database initialization completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });
