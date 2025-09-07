-- Create database (run this in your PostgreSQL client first)
-- CREATE DATABASE resume_analyzer;

-- Connect to the database and run the following:

-- Create table for storing resume data
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

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_resumes_email ON resumes(email);

-- Create index on uploaded_at for sorting
CREATE INDEX IF NOT EXISTS idx_resumes_uploaded_at ON resumes(uploaded_at);

-- Create index on resume_rating for filtering
CREATE INDEX IF NOT EXISTS idx_resumes_rating ON resumes(resume_rating);
