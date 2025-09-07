import pg from 'pg';
import { fileURLToPath } from 'url';
import path from 'path';
import { promises as fs } from 'fs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupDatabase() {
  // Connect to default postgres database
  const adminPool = new pg.Pool({
    user: 'postgres', // Default superuser
    password: 'Vishnu@123', // Default password - change this in production!
    host: 'localhost',
    port: 5432,
    database: 'postgres', // Connect to default postgres database
  });

  const client = await adminPool.connect();

  try {
    // Check if database exists
    const dbName = 'resume_analyzer';
    const dbCheck = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName]);

    if (dbCheck.rows.length === 0) {
      console.log(`Creating database ${dbName}...`);
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`Database ${dbName} created successfully`);
    } else {
      console.log(`Database ${dbName} already exists`);
    }

    // Now connect to the application database
    await client.release();
    const appPool = new pg.Pool({
      user: 'postgres',
      password: 'Vishnu@123',
      host: 'localhost',
      port: 5432,
      database: dbName,
    });

    const appClient = await appPool.connect();

    try {
      // Read and execute schema SQL
      const schemaPath = path.join(__dirname, '../db/init.sql');
      const schemaSql = await fs.readFile(schemaPath, 'utf8');

      // Split the SQL file into individual statements and execute them
      const statements = schemaSql
        .split(';')
        .map((statement) => statement.trim())
        .filter((statement) => statement.length > 0);

      for (const statement of statements) {
        try {
          await appClient.query(statement);
          console.log('Executed:', statement.split('\n')[0].substring(0, 50) + '...');
        } catch (err) {
          console.error('Error executing statement:', err.message);
          throw err;
        }
      }

      console.log('Database setup completed successfully!');
    } finally {
      await appClient.release();
      await appPool.end();
    }
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  } finally {
    await client.release();
    await adminPool.end();
  }
}

setupDatabase();
