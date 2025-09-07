# 🗄️ Database Migration Guide

This guide will help you migrate from local PostgreSQL to a cloud database.

## 🎯 **Migration Options**

### **Option 1: Render PostgreSQL (Recommended)**
- **Free Tier**: 1GB storage, 1GB RAM
- **Easy Setup**: Built-in with Render deployment
- **Automatic Backups**: Daily backups included

### **Option 2: Railway PostgreSQL**
- **Free Tier**: 1GB storage, 1GB RAM
- **Easy Setup**: Simple connection string
- **Good Performance**: Fast and reliable

### **Option 3: Supabase**
- **Free Tier**: 500MB storage, 2GB bandwidth
- **Additional Features**: Real-time, Auth, Storage
- **PostgreSQL**: Full PostgreSQL compatibility

## 🚀 **Step-by-Step Migration Process**

### **Step 1: Create Cloud Database**

#### **For Render:**
1. Go to [render.com](https://render.com) and sign up
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `resume-analyzer-db`
   - **Plan**: Free
   - **Region**: Choose closest to your users
4. Click **"Create Database"**
5. **Save the connection details**:
   - Host
   - Port
   - Database
   - User
   - Password

#### **For Railway:**
1. Go to [railway.app](https://railway.app) and sign up
2. Click **"New Project"**
3. Add **PostgreSQL** service
4. Get connection string from **Variables** tab

#### **For Supabase:**
1. Go to [supabase.com](https://supabase.com) and sign up
2. Create new project
3. Go to **Settings** → **Database**
4. Copy connection details

### **Step 2: Update Environment Variables**

Create a new `.env` file for production:

```bash
# Production Database Configuration
NODE_ENV=production
PORT=5001

# Database Configuration (Replace with your cloud DB details)
DB_HOST=your-cloud-db-host
DB_PORT=5432
DB_DATABASE=your-database-name
DB_USER=your-username
DB_PASSWORD=your-password

# API Configuration
GOOGLE_API_KEY=your-gemini-api-key
JWT_SECRET=your-jwt-secret

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### **Step 3: Test Database Connection**

Create a test script to verify connection:

```bash
# Create test file
echo 'import dotenv from "dotenv";
import pkg from "pg";
const { Pool } = pkg;

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log("✅ Database connected successfully!");
    const result = await client.query("SELECT NOW()");
    console.log("Current time:", result.rows[0].now);
    client.release();
    await pool.end();
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
}

testConnection();' > test-cloud-db.js

# Run test
node test-cloud-db.js
```

### **Step 4: Initialize Database Schema**

Run the database initialization:

```bash
# Initialize database schema
cd backend
node scripts/initDb.js
```

### **Step 5: Migrate Existing Data (Optional)**

If you have existing data in your local database:

```bash
# Export local data
pg_dump -h localhost -U your-username -d your-local-db > local-data.sql

# Import to cloud database
psql -h your-cloud-host -U your-username -d your-cloud-db < local-data.sql
```

### **Step 6: Update Application Configuration**

Update your backend to use the new database:

```bash
# Update .env file
cp .env.example .env
# Edit .env with your cloud database details
```

### **Step 7: Test Application**

1. Start your backend: `npm run dev`
2. Test database operations:
   - Upload a resume
   - Check history
   - Verify data persistence

## 🔧 **Troubleshooting**

### **Common Issues:**

1. **Connection Refused**
   - Check host and port
   - Verify firewall settings
   - Ensure database is running

2. **Authentication Failed**
   - Verify username and password
   - Check user permissions
   - Ensure user exists in database

3. **SSL Certificate Issues**
   - Add `ssl: { rejectUnauthorized: false }` for development
   - Use proper SSL certificates for production

4. **Schema Not Found**
   - Run `initDb.js` script
   - Check table creation logs
   - Verify database permissions

## 📊 **Database Comparison**

| Feature | Render | Railway | Supabase |
|---------|--------|---------|----------|
| Free Storage | 1GB | 1GB | 500MB |
| Free RAM | 1GB | 1GB | 512MB |
| Backups | Daily | Manual | Daily |
| SSL | Yes | Yes | Yes |
| Connection Pooling | Yes | Yes | Yes |
| Real-time | No | No | Yes |
| Auth | No | No | Yes |
| Storage | No | No | Yes |

## 🎯 **Recommendation**

**For your Resume Analyzer project, I recommend Render PostgreSQL because:**
- Easy integration with Render deployment
- Good free tier (1GB storage)
- Automatic backups
- Simple setup process
- Reliable performance

## 📞 **Next Steps**

1. Choose your cloud database provider
2. Create database instance
3. Update environment variables
4. Test connection
5. Initialize schema
6. Test application
7. Deploy to production

After database migration, you'll be ready for deployment!