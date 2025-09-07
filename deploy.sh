#!/bin/bash

# 🚀 Resume Analyzer Deployment Script for Render

echo "🚀 Starting Resume Analyzer deployment to Render..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git not initialized. Please run: git init"
    exit 1
fi

# Check if files are committed
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Uncommitted changes detected. Committing..."
    git add .
    git commit -m "Deploy to Render - $(date)"
fi

# Push to GitHub (assuming origin is set)
echo "📤 Pushing to GitHub..."
git push origin main

echo "✅ Code pushed to GitHub!"
echo ""
echo "📋 Next steps:"
echo "1. Go to https://dashboard.render.com"
echo "2. Create PostgreSQL database"
echo "3. Deploy backend web service"
echo "4. Deploy frontend static site"
echo "5. Set environment variables"
echo "6. Initialize database"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"