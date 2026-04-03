#!/bin/bash
# Create a clean release package for Hostinger deployment

set -e

echo "========================================"
echo "Cardzey - Create Release Package"
echo "========================================"
echo ""

# Build the frontend
echo "📦 Building frontend..."
npm run build

# Create release directory
echo "📁 Creating release package..."
rm -rf release
mkdir -p release

# Copy frontend
echo "  → Copying frontend..."
cp -r dist/* release/

# Copy api (excluding sensitive files)
echo "  → Copying api..."
cp -r api release/
# Remove any .env files (security: never include actual credentials)
rm -f release/api/.env 2>/dev/null || true

# Copy api .htaccess
cp api/.htaccess release/api/ 2>/dev/null || true

# Copy documentation
echo "  → Adding documentation..."
cp DEPLOYMENT-INSTRUCTIONS.txt release/ 2>/dev/null || true
cp QUICK-START-HOSTINGER.md release/ 2>/dev/null || true

# Create simple deploy guide
cat > release/README-DEPLOY.txt << 'EOF'
╔═══════════════════════════════════════════════════════════════════╗
║           CV ANALYZER - HOSTINGER DEPLOYMENT PACKAGE            ║
╚═══════════════════════════════════════════════════════════════════╝

🎉 Congratulations! You have everything you need to deploy Cardzey.

📦 WHAT'S IN THIS PACKAGE
  ✓ Frontend (React SPA) - static HTML/CSS/JS files
  ✓ Backend API (PHP) - complete with all dependencies
  ✓ Database schema - ready to import
  ✓ Configuration templates - just fill in your details
  ✓ .htaccess files - Apache routing rules

🚀 QUICK DEPLOY (8 STEPS):
1. Upload all files EXCEPT api/ to public_html/
2. Upload api/ to public_html/api/
3. Create database in Hostinger
4. Edit public_html/api/.env with DB credentials
5. Import install.sql via phpMyAdmin
6. Set upload/ folder permission to 755
7. Enable SSL
8. Done! 🎉

🔐 SECURITY: Change DB password, generate strong JWT_SECRET

See DEPLOYMENT-INSTRUCTIONS.txt or DEPLOY.html for detailed guide.
EOF

# Create ZIP
echo "📦 Creating ZIP archive..."
rm -f cardzey-hostinger-release.zip
cd release
zip -r ../cardzey-hostinger-release.zip ./* 2>/dev/null
cd ..

echo ""
echo "✅ Release package created!"
echo ""
echo "📦 Files:"
echo "  • release/                (13MB folder)"
echo "  • cardzey-hostinger-release.zip (compressed)"
echo ""
echo "🚀 To deploy:"
echo "  1. Upload release/ folder contents to Hostinger"
echo "  2. Follow README-DEPLOY.txt or DEPLOY.html"
echo ""
echo "Or download cardzey-hostinger-release.zip from GitHub Releases"
echo ""
