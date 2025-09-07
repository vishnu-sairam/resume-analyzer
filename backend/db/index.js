import pg from 'pg';
const { Pool } = pg;

// Create a connection pool
export const pool = new Pool({
  user: process.env.DB_USER || 'postgres', // Default to 'postgres' if not set
  host: process.env.DB_HOST || 'localhost', // Default to 'localhost' if not set
  database: process.env.DB_DATABASE || 'resume_analyzer',
  password: process.env.DB_PASSWORD || 'Vishnu@123', // Default password if not set
  port: parseInt(process.env.DB_PORT) || 5432, // Default to 5432 if not set
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // How long to wait when connecting a new client
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
