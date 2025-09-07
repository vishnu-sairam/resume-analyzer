import { pool } from './index.js';

export const initDB = async () => {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS resumes (
      id SERIAL PRIMARY KEY,
      file_name VARCHAR(255) NOT NULL,
      uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      name VARCHAR(255),
      email VARCHAR(255),
      phone VARCHAR(50),
      linkedin_url VARCHAR(255),
      portfolio_url VARCHAR(255),
      summary TEXT,
      work_experience JSONB,
      education JSONB,
      technical_skills JSONB,
      soft_skills JSONB,
      projects JSONB,
      certifications JSONB,
      resume_rating INTEGER,
      improvement_areas TEXT,
      upskill_suggestions JSONB
    );
    CREATE INDEX IF NOT EXISTS idx_resumes_email ON resumes(email);
    CREATE INDEX IF NOT EXISTS idx_resumes_uploaded_at ON resumes(uploaded_at);
    CREATE INDEX IF NOT EXISTS idx_resumes_rating ON resumes(resume_rating);
  `;

  const client = await pool.connect();
  try {
    await client.query(createTableSQL);
    console.log('✅ resumes table ready');
  } catch (err) {
    console.error('❌ DB init error:', err.message);
    throw err;
  } finally {
    client.release();
  }
};

