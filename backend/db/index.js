import pg from 'pg';
const { Pool } = pg;

// Prefer single DATABASE_URL when provided (Render)
const databaseUrl = process.env.DATABASE_URL;
const shouldUseSsl = true; // Render requires SSL

// Create a connection pool
export const pool = databaseUrl
  ? new Pool({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } })
  : new Pool({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_DATABASE || 'resume_analyzer',
      password: process.env.DB_PASSWORD || 'postgres',
      port: parseInt(process.env.DB_PORT) || 5432,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
      ssl: shouldUseSsl ? { rejectUnauthorized: false } : false,
    });

// Handle connection errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Test the database connection
const testConnection = async () => {
  let client;
  try {
    client = await pool.connect();
    await client.query('SELECT NOW()');
    console.log('Successfully connected to PostgreSQL database');
    return true;
  } catch (error) {
    console.error('Error connecting to PostgreSQL database:', error.message);
    return false;
  } finally {
    if (client) {
      client.release();
    }
  }
};

// Graceful shutdown
const closePool = async () => {
  try {
    console.log('Closing database connection pool...');
    await pool.end();
    console.log('Database connection pool has been closed');
  } catch (err) {
    console.error('Error closing database connection pool:', err);
  }
};

// Handle application termination
process.on('SIGINT', async () => {
  await closePool();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closePool();
  process.exit(0);
});

// Export functions
export const query = (text, params) => pool.query(text, params);

export { testConnection, closePool };
