#!/bin/bash
# CV Analyzer - One-Click Deployment Package Creator
# Run this script to generate a fresh deployment package

set -e

echo "========================================"
echo "CV Analyzer - Build & Package"
echo "========================================"
echo ""

# Check if Node.js is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install Node.js first."
    exit 1
fi

# Build frontend
echo "📦 Building frontend..."
npm run build

# Create package
echo "📁 Creating deployment package..."
rm -rf deploy/hostinger
mkdir -p deploy/hostinger

# Copy frontend
cp -r dist/* deploy/hostinger/

# Copy backend
cp -r backend deploy/hostinger/
# Remove any .env files (security: never include actual credentials)
rm -f deploy/hostinger/backend/.env 2>/dev/null || true

# Copy .htaccess
cp deploy/hostinger/.htaccess deploy/hostinger/ 2>/dev/null || true

# Copy documentation
cp DEPLOYMENT.md deploy/hostinger/
cp QUICK-START-HOSTINGER.md deploy/hostinger/README-HOSTINGER.md
cp HOSTINGER-MIGRATION-SUMMARY.md deploy/hostinger/MIGRATION-SUMMARY.md 2>/dev/null || true

# Create simple deploy guide
cat > deploy/hostinger/DEPLOY.html << 'HTML'
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Deploy to Hostinger</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 2rem auto; padding: 0 1rem; line-height: 1.6; }
    h1 { color: #3b82f6; }
    .step { background: #eff6ff; padding: 1rem; margin: 1rem 0; border-radius: 8px; border-left: 4px solid #3b82f6; }
    code { background: #f1f5f9; padding: 0.2rem 0.4rem; border-radius: 3px; }
    pre { background: #1e293b; color: #e2e8f0; padding: 1rem; border-radius: 8px; overflow-x: auto; }
  </style>
</head>
<body>
  <h1>🚀 Deploy to Hostinger</h1>
  <p>Follow these 5 simple steps:</p>
  
  <div class="step">
    <strong>Step 1: Upload Files</strong><br>
    Upload all files in this folder to <code>public_html/</code> on Hostinger (use File Manager or FTP).
    <br><em>Note: The <code>api/</code> folder should go to <code>public_html/api/</code></em>
  </div>
  
  <div class="step">
    <strong>Step 2: Create Database</strong><br>
    In hPanel → Databases, create a MySQL database. Save the credentials.
  </div>
  
  <div class="step">
    <strong>Step 3: Configure .env</strong><br>
    Go to <code>public_html/api/</code>, copy <code>.env.example</code> to <code>.env</code>, and fill in:
    <pre>
DB_HOST=localhost
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASS=your_database_password
JWT_SECRET=openssl rand -hex 32
ALLOWED_ORIGINS=https://yourdomain.com
    </pre>
  </div>
  
  <div class="step">
    <strong>Step 4: Import Database</strong><br>
    In hPanel → phpMyAdmin, select your database, click Import, and upload <code>install.sql</code>.
  </div>
  
  <div class="step">
    <strong>Step 5: Set Permissions</strong><br>
    Set <code>upload/</code> folder permissions to 755 (writable).
  </div>
  
  <p><strong>Done!</strong> Visit <code>https://yourdomain.com</code> and <code>https://yourdomain.com/api/</code></p>
  <p>See <code>README-HOSTINGER.md</code> for detailed instructions.</p>
</body>
</html>
HTML

echo "✅ Deployment package created!"
echo ""
echo "📦 Package location: deploy/hostinger/"
echo "📊 Package size: $(du -sh deploy/hostinger | cut -f1)"
echo ""
echo "Contents:"
echo "  - Frontend files (index.html, assets/)"
echo "  - Backend API (api/ with vendor/)"
echo "  - DEPLOY.html (visual guide)"
echo "  - README-HOSTINGER.md (detailed guide)"
echo ""
echo "🚀 To deploy: Upload deploy/hostinger/ contents to Hostinger public_html/"
echo ""
echo "Happy deploying! ✨"
