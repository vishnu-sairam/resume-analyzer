import pg from 'pg';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Database configuration
const pool = new pg.Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_DATABASE || 'resume_analyzer',
  password: process.env.DB_PASSWORD || 'Vishnu@123',
  port: parseInt(process.env.DB_PORT) || 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Sample data
const sampleResumes = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    file_name: 'john_doe_resume.pdf',
    file_size: 102400, // 100KB
    file_type: 'application/pdf',
    status: 'completed',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    linkedin_url: 'https://linkedin.com/in/johndoe',
    portfolio_url: 'https://johndoe.dev',
    summary: 'Experienced software engineer with 5+ years of experience in full-stack development.',
    work_experience: [
      {
        role: 'Senior Software Engineer',
        company: 'Tech Corp Inc.',
        duration: '2020 - Present',
        description: [
          'Led a team of 5 developers to build a scalable microservices architecture',
          'Implemented CI/CD pipelines reducing deployment time by 40%',
          'Mentored junior developers and conducted code reviews',
        ],
      },
      {
        role: 'Software Engineer',
        company: 'Web Solutions LLC',
        duration: '2018 - 2020',
        description: [
          'Developed and maintained RESTful APIs using Node.js and Express',
          'Collaborated with frontend developers to integrate user-facing elements',
          'Optimized database queries resulting in 30% performance improvement',
        ],
      },
    ],
    education: [
      {
        degree: 'Master of Science in Computer Science',
        institution: 'University of Technology',
        graduation_year: '2018',
      },
      {
        degree: 'Bachelor of Science in Computer Science',
        institution: 'State University',
        graduation_year: '2016',
      },
    ],
    technical_skills: [
      'JavaScript',
      'Node.js',
      'React',
      'PostgreSQL',
      'Docker',
      'AWS',
      'RESTful APIs',
    ],
    soft_skills: ['Leadership', 'Teamwork', 'Problem Solving', 'Communication'],
    projects: [
      {
        name: 'E-commerce Platform',
        description: 'A full-stack e-commerce platform with payment integration',
        technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      },
    ],
    certifications: ['AWS Certified Developer', 'Google Cloud Professional'],
    resume_rating: 8,
    improvement_areas:
      'Could include more metrics and quantifiable achievements in work experience.',
    upskill_suggestions: [
      'Learn GraphQL',
      'Explore serverless architecture',
      'Improve knowledge of container orchestration with Kubernetes',
    ],
  },
  {
    id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    file_name: 'jane_smith_resume.pdf',
    file_size: 92160, // 90KB
    file_type: 'application/pdf',
    status: 'completed',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1 (555) 987-6543',
    linkedin_url: 'https://linkedin.com/in/janesmith',
    portfolio_url: 'https://janesmith.dev',
    summary:
      'Frontend developer with 3+ years of experience in React and modern JavaScript frameworks.',
    work_experience: [
      {
        role: 'Frontend Developer',
        company: 'Digital Creations',
        duration: '2019 - Present',
        description: [
          'Developed responsive web applications using React and Redux',
          'Optimized application performance, reducing load time by 30%',
          'Collaborated with UX/UI designers to implement pixel-perfect designs',
        ],
      },
    ],
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        institution: 'City University',
        graduation_year: '2019',
      },
    ],
    technical_skills: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Redux', 'TypeScript', 'Jest'],
    soft_skills: ['Creativity', 'Attention to Detail', 'Time Management', 'Collaboration'],
    projects: [
      {
        name: 'Task Management App',
        description: 'A collaborative task management application',
        technologies: ['React', 'Redux', 'Firebase'],
      },
    ],
    certifications: ['Frontend Developer Nanodegree'],
    resume_rating: 7,
    improvement_areas: 'Could benefit from including more quantitative results and achievements.',
    upskill_suggestions: [
      'Learn Next.js',
      'Improve testing with React Testing Library',
      'Explore state management with Zustand',
    ],
  },
];

// Function to seed the database
const seedDatabase = async () => {
  const client = await pool.connect();

  try {
    console.log('Starting database seeding...');
    await client.query('BEGIN');

    // Clear existing data
    console.log('Clearing existing data...');
    await client.query('TRUNCATE TABLE resumes CASCADE');
    console.log('Cleared existing data');

    // Insert sample data
    console.log('Inserting sample data...');

    for (const resume of sampleResumes) {
      const {
        id,
        file_name,
        file_size,
        file_type,
        status,
        name,
        email,
        phone,
        linkedin_url,
        portfolio_url,
        summary,
        work_experience,
        education,
        technical_skills,
        soft_skills,
        projects,
        certifications,
        resume_rating,
        improvement_areas,
        upskill_suggestions,
      } = resume;

      const queryText = `
        INSERT INTO resumes (
          id, file_name, file_size, file_type, status, 
          name, email, phone, linkedin_url, portfolio_url, 
          summary, work_experience, education, technical_skills, 
          soft_skills, projects, certifications, resume_rating, 
          improvement_areas, upskill_suggestions
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 
          $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
        )
        RETURNING id, name
      `;

      const values = [
        id || uuidv4(),
        file_name,
        file_size,
        file_type,
        status || 'completed',
        name,
        email,
        phone,
        linkedin_url,
        portfolio_url,
        summary,
        JSON.stringify(work_experience || []),
        JSON.stringify(education || []),
        JSON.stringify(technical_skills || []),
        JSON.stringify(soft_skills || []),
        JSON.stringify(projects || []),
        JSON.stringify(certifications || []),
        resume_rating || 0,
        improvement_areas || '',
        JSON.stringify(upskill_suggestions || []),
      ];

      const result = await client.query(queryText, values);
      console.log(`Added resume for ${result.rows[0].name}`);
    }

    await client.query('COMMIT');
    console.log('Database seeded successfully!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

// Run the seeding
seedDatabase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error in seed script:', error);
    process.exit(1);
  });
