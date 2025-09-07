# 🚀 Render Deployment Guide

This guide will help you deploy your Resume Analyzer to Render.

## 📋 Prerequisites

1. **GitHub Repository**: Push your code to GitHub
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **Google API Key**: Your Gemini API key

## 🗄️ Step 1: Create PostgreSQL Database

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `resume-analyzer-db`
   - **Plan**: Free
   - **Region**: Choose closest to your users
4. Click **"Create Database"**
5. **Save the connection details** (you'll need them later)

## 🔧 Step 2: Deploy Backend

1. In Render Dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `resume-analyzer-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free

### Environment Variables:
```
NODE_ENV=production
PORT=10000
DB_HOST=<from database>
DB_PORT=<from database>
DB_DATABASE=<from database>
DB_USER=<from database>
DB_PASSWORD=<from database>
GOOGLE_API_KEY=<your-api-key>
JWT_SECRET=<generate-random-string>
CORS_ORIGIN=https://resume-analyzer-frontend.onrender.com
```

4. Click **"Create Web Service"**

## 🎨 Step 3: Deploy Frontend

1. In Render Dashboard, click **"New +"** → **"Static Site"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `resume-analyzer-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/build`
   - **Plan**: Free

### Environment Variables:
```
REACT_APP_API_URL=https://resume-analyzer-backend.onrender.com
```

4. Click **"Create Static Site"**

## 🗃️ Step 4: Initialize Database

1. Go to your backend service
2. Click **"Shell"** tab
3. Run database initialization:
```bash
cd backend
node scripts/initDb.js
```

## 🔗 Step 5: Update CORS

1. Go to your backend service settings
2. Update `CORS_ORIGIN` environment variable with your frontend URL
3. Redeploy the backend

## ✅ Step 6: Test Deployment

1. Visit your frontend URL
2. Upload a test resume
3. Check if analysis works
4. Verify history functionality

## 🔧 Troubleshooting

### Common Issues:

1. **Database Connection Failed**
   - Check environment variables
   - Ensure database is running
   - Verify connection string

2. **CORS Errors**
   - Update CORS_ORIGIN with correct frontend URL
   - Redeploy backend after changes

3. **API Key Issues**
   - Verify GOOGLE_API_KEY is set correctly
   - Check API key permissions

4. **Build Failures**
   - Check build logs in Render dashboard
   - Ensure all dependencies are in package.json

## 📊 Monitoring

- **Logs**: Available in Render dashboard
- **Metrics**: CPU, Memory usage
- **Uptime**: Service health monitoring

## 💰 Cost

- **Free Tier**: 750 hours/month per service
- **Database**: 1GB storage, 1GB RAM
- **Web Service**: 512MB RAM
- **Static Site**: Unlimited bandwidth

## 🔄 Updates

To update your deployment:
1. Push changes to GitHub
2. Render automatically redeploys
3. Database changes require manual migration

## 📞 Support

- **Render Docs**: [render.com/docs](https://render.com/docs)
- **Community**: [render.com/community](https://render.com/community)
- **Status**: [status.render.com](https://status.render.com)