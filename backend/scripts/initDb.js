import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });

// Create a new pool
const pool = new pg.Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_DATABASE || 'postgres',
  password: process.env.DB_PASSWORD || 'Vishnu@123',
  port: parseInt(process.env.DB_PORT) || 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Get the current directory in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read SQL file
const readSqlFile = async (filePath) => {
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch (err) {
    console.error('Error reading SQL file:', err);
    throw err;
  }
};

const initializeDatabase = async () => {
  const client = await pool.connect();

  try {
    console.log('Starting database initialization...');

    // Read and execute schema SQL
    console.log('Creating tables...');
    const schemaSql = await readSqlFile(path.join(__dirname, '../db/init.sql'));

    // Split the SQL file into individual statements and execute them
    const statements = schemaSql
      .split(';')
      .map((statement) => statement.trim())
      .filter((statement) => statement.length > 0);

    for (const statement of statements) {
      try {
        await client.query(statement);
        console.log('Executed:', statement.split('\n')[0].substring(0, 50) + '...');
      } catch (error) {
        // Ignore "relation already exists" errors
        if (!error.message.includes('already exists')) {
          throw error;
        }
      }
    }

    console.log('✅ Database initialized successfully!');
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    throw error;
  } finally {
    client.release();
    pool.end();
  }
};

// Run the initialization
initializeDatabase()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
