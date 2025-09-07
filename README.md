# Resume Analyzer - Full-Stack Web Application

A comprehensive full-stack web application that analyzes resumes using AI to extract key information and provide improvement suggestions. Built with React.js frontend, Node.js/Express.js backend, PostgreSQL database, and Google Gemini AI.

## 🎯 Features

### Tab 1: Live Resume Analysis
- **File Upload**: Upload PDF resumes through an intuitive interface
- **AI-Powered Analysis**: Extract structured information using Google Gemini LLM
- **Comprehensive Data Extraction**:
  - Personal Details (Name, Email, Phone, LinkedIn/Portfolio URLs)
  - Professional Summary/Objective
  - Work Experience with detailed descriptions
  - Education background
  - Technical and Soft Skills categorization
  - Projects and Certifications
- **AI-Generated Feedback**:
  - Resume rating (1-10 scale)
  - Specific improvement areas
  - Upskilling suggestions relevant to the profile
- **Database Storage**: All analyzed resumes are saved for future reference

### Tab 2: Historical Viewer
- **Data Display**: View all previously analyzed resumes in a clean table format
- **Key Information**: Name, email, skills, rating, and upload date
- **Details Modal**: Click "Details" to view complete analysis using the same UI components
- **Management**: Delete old analyses as needed

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **PostgreSQL** (v12 or higher) - [Download here](https://www.postgresql.org/download/)
- **Google Gemini API Key** - [Get it from Google AI Studio](https://makersuite.google.com/)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/resume-analyzer.git
   cd resume-analyzer
   ```

2. **Set up the database**
   ```bash
   # Create a PostgreSQL database named 'resume_analyzer'
   # You can use pgAdmin or command line:
   createdb resume_analyzer
   ```

3. **Configure the backend**
   ```bash
   cd backend
   npm install
   
   # Create environment file
   cp .env.example .env
   # Edit .env with your configuration (see Environment Variables section below)
   
   # Initialize the database tables
   npm run db:init
   
   # Start the backend server
   npm run dev
   ```

4. **Configure the frontend**
   ```bash
   cd ../frontend
   npm install
   
   # Start the development server
   npm start
   ```

5. **Access the application**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:5001
   - **Health Check**: http://localhost:5001/api/health

## ⚙️ Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Database Configuration
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=resume_analyzer
DB_PASSWORD=your_postgres_password
DB_PORT=5432

# Google AI (Gemini) Configuration
GOOGLE_API_KEY=your_google_gemini_api_key_here

# File Upload Configuration
MAX_FILE_UPLOAD=5
FILE_UPLOAD_PATH=./uploads/

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

## 📁 Project Structure

```
resume-analyzer/
├── backend/                 # Node.js/Express.js backend
│   ├── controllers/         # Route controllers
│   ├── db/                 # Database configuration and initialization
│   ├── middleware/         # Custom middleware
│   ├── routes/            # API routes
│   ├── scripts/           # Database scripts
│   ├── utils/             # Utility functions
│   └── server.js          # Main server file
├── frontend/              # React.js frontend
│   ├── public/           # Static files
│   └── src/              # Source code
│       ├── components/   # Reusable components
│       ├── pages/        # Page components
│       └── services/     # API services
├── sample_data/          # Sample resume PDFs for testing
├── screenshots/          # Application screenshots
└── README.md            # This file
```

## 🧪 Testing

### Using Sample Data

The `sample_data/` folder contains sample resume text files that can be used for testing:
- `john_doe_resume.txt` - Software Engineer with 3 years experience
- `jane_smith_resume.txt` - Data Scientist with 5 years experience
- `mike_wilson_resume.txt` - Frontend Developer with 2 years experience

**Note**: Convert these text files to PDF format before uploading to test the application.

### Manual Testing

1. **Upload a Resume**: Go to the "Analyze Resume" tab and upload a PDF resume
2. **View Results**: Check the extracted information and AI feedback
3. **Check History**: Switch to "View History" tab to see saved analyses
4. **View Details**: Click "Details" button to see full analysis in modal

## 🛠️ Development Scripts

### Backend Scripts
```bash
cd backend
npm start          # Start production server
npm run dev        # Start development server with hot-reload
npm run db:init    # Initialize database tables
npm run db:seed    # Seed database with sample data
npm run db:reset   # Reset database (init + seed)
npm run lint       # Run ESLint
npm test          # Run tests
```

### Frontend Scripts
```bash
cd frontend
npm start         # Start development server
npm run build     # Build for production
npm test         # Run tests
npm run lint     # Run ESLint
npm run format   # Format code with Prettier
```

## 📚 API Documentation

### Endpoints

- `POST /api/resumes/upload` - Upload and analyze a resume
  - **Content-Type**: `multipart/form-data`
  - **Body**: `resume` (PDF file)
  - **Response**: Complete analyzed resume data with AI feedback

- `GET /api/resumes` - Get all analyzed resumes
  - **Response**: Array of resume summaries

- `GET /api/resumes/:id` - Get specific resume details
  - **Response**: Complete resume analysis data

- `DELETE /api/resumes/:id` - Delete a resume analysis
  - **Response**: Success confirmation

- `GET /api/health` - Health check endpoint
  - **Response**: Server and database status

## 🚀 Deployment

### Production Build

1. **Backend**
   ```bash
   cd backend
   npm install --production
   NODE_ENV=production npm start
   ```

2. **Frontend**
   ```bash
   cd frontend
   npm run build
   # Serve the build folder with a static file server
   ```

### Environment Considerations

- Set `NODE_ENV=production`
- Configure production database credentials
- Set up HTTPS for security
- Configure CORS for your production domain
- Set up proper file upload limits and storage

## 🛡️ Security Features

- File upload validation (type and size limits)
- SQL injection prevention with parameterized queries
- Environment variables for sensitive configuration
- CORS configuration for frontend domain
- Input sanitization and validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Google Gemini API](https://ai.google.dev/) for AI-powered resume analysis
- [Material-UI](https://mui.com/) for beautiful UI components
- [React](https://reactjs.org/) for the frontend framework
- [Express.js](https://expressjs.com/) for the backend framework
- [PostgreSQL](https://www.postgresql.org/) for reliable data storage

## 🚀 Deployment

### Render Deployment (Recommended)

For production deployment, we recommend using Render:

1. **Quick Deploy**: Use the `render.yaml` configuration file
2. **Manual Deploy**: Follow the detailed guide in `DEPLOYMENT.md`
3. **Free Tier**: 1GB RAM, PostgreSQL database, automatic SSL

```bash
# Quick deployment script
chmod +x deploy.sh
./deploy.sh
```

### Other Platforms

- **Heroku**: Use Heroku Postgres addon
- **Railway**: Similar to Render, good free tier
- **Vercel + Supabase**: Frontend on Vercel, database on Supabase
- **AWS**: RDS for database, EC2/ECS for backend, S3 for frontend

## 📞 Support

If you encounter any issues or have questions, please:
1. Check the troubleshooting section below
2. Review the API documentation
3. Open an issue on GitHub

### Common Issues

**Database Connection Error**: Ensure PostgreSQL is running and credentials in `.env` are correct
**File Upload Fails**: Check file size (max 5MB) and ensure it's a valid PDF
**AI Analysis Fails**: Verify your Google Gemini API key is valid and has sufficient quota
**Deployment Issues**: Check `DEPLOYMENT.md` for platform-specific solutions