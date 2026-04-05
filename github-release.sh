#!/bin/bash
# Create GitHub Release with deployment package
# Note: Requires GitHub CLI (gh) to be installed and authenticated
# https://cli.github.com/

set -e

echo "========================================"
echo "Cardzey - Create GitHub Release"
echo "========================================"
echo ""

# Check if gh is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo "Install from: https://cli.github.com/"
    echo ""
    echo "Alternative: Create release manually:"
    echo "  1. Build package: ./create-release.sh"
    echo "  2. Go to: https://github.com/animeprints/portfolioanalyzer/releases/new"
    echo "  3. Upload cardzey-hostinger-release.zip"
    echo "  4. Add release notes and publish"
    exit 1
fi

# Build the release package first
echo "Building release package..."
./create-release.sh

# Check if ZIP exists
if [ ! -f "cardzey-hostinger-release.zip" ]; then
    echo "❌ ZIP file not found. Build failed."
    exit 1
fi

# Get latest commit message
TAG="v1.0.0"
TITLE="Cardzey CV Analyzer - Hostinger Deployment"
BODY=$(cat << 'EOF'
## 🚀 Quick Deploy

**Download** `cardzey-hostinger-release.zip` (3MB) and upload to Hostinger.

### For Non-Technical Users:

1. Download the ZIP file
2. Extract to a folder
3. Upload files to Hostinger File Manager:
   - All files EXCEPT `backend/` → `public_html/`
   - `backend/` folder → `public_html/api/`
4. Create database and configure `.env`
5. Import `install.sql`
6. Done! See `README-DEPLOY.txt` for details.

### What's Included:

- ✅ Complete frontend (PWA-enabled)
- ✅ Backend PHP API with all dependencies
- ✅ .htaccess files for routing
- ✅ Database schema
- ✅ Step-by-step deployment guides

### Security Checklist:

- ☐ Change default database password
- ☐ Generate strong `JWT_SECRET` (openssl rand -hex 32)
- ☐ Set `ALLOWED_ORIGINS` to your domain
- ☐ Enable SSL/HTTPS

### Documentation:

- `README-DEPLOY.txt` - Plain text guide (included in ZIP)
- `DEPLOY.html` - Visual browser guide (included in ZIP)
- `DEPLOYMENT.md` - Full documentation (in repo)
- `QUICK-START-HOSTINGER.md` - Quick reference (in repo)

See [full documentation](https://github.com/animeprints/portfolioanalyzer/tree/main#readme) for more.

---

**Need help?** Check included guides or open an issue on GitHub.
EOF
)

echo ""
echo "Creating GitHub release..."
echo "Tag: $TAG"
echo "Title: $TITLE"
echo ""

# Create release
gh release create "$TAG" \
  --title "$TITLE" \
  --notes "$BODY" \
  cardzey-hostinger-release.zip

echo ""
echo "✅ Release created successfully!"
echo ""
echo "🔗 URL: https://github.com/animeprints/portfolioanalyzer/releases/tag/$TAG"
echo "📦 Assets:"
gh release view "$TAG" --json assets --jq '.assets[] | "  - \(.name) (\(.size | tostring) bytes)"'
