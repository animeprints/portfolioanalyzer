# GitHub Releases - How to Create

## Manual Release Creation (No GitHub CLI)

Since GitHub CLI is not available, follow these steps to create a release:

### Step 1: Build the Release Package

```bash
./create-release.sh
```

This creates:
- `cardzey-hostinger-release.zip` (3MB)
- `release/` folder (13MB)

### Step 2: Create GitHub Release

1. Go to: https://github.com/animeprints/portfolioanalyzer/releases/new
2. Fill in the form:

   **Tag version**: `v1.0.0` (or latest)
   
   **Release title**: `Cardzey CV Analyzer - Hostinger Ready`
   
   **Description**: Copy the content below (or use the auto-generated if using GitHub CLI)
   
   **Attach binaries**: Upload `cardzey-hostinger-release.zip`

3. Click **Publish release**

---

## Release Notes Template

```
## 🚀 Cardzey CV Analyzer - Hostinger Deployment

### Quick Deploy (for non-technical users):

1. Download `cardzey-hostinger-release.zip`
2. Extract to a folder
3. Upload to Hostinger:
   - All files EXCEPT `backend/` → `public_html/`
   - `backend/` folder → `public_html/api/`
4. Create MySQL database in Hostinger
5. Edit `public_html/api/.env` with database credentials
6. Import `public_html/api/install.sql` via phpMyAdmin
7. Set `upload/` folder permission to 755
8. Enable SSL (Free SSL in Hostinger Security panel)
9. Done! Visit https://yourdomain.com

### What's Included:

- ✅ Complete frontend (React + Vite build, PWA-enabled)
- ✅ Backend PHP API with all dependencies (`vendor/` included)
- ✅ .htaccess files for Apache routing
- ✅ Database schema (`install.sql`)
- ✅ Configuration template (`.env.example`)
- ✅ Documentation (README-DEPLOY.txt, DEPLOY.html)

### Security Checklist:

- [ ] Change database password from defaults
- [ ] Generate strong `JWT_SECRET`: `openssl rand -hex 32`
- [ ] Set `ALLOWED_ORIGINS` to your actual domain in `.env`
- [ ] Enable HTTPS (SSL)
- [ ] Keep `.env` file private

### Need Help?

- Read `README-DEPLOY.txt` (included)
- Open `DEPLOY.html` in browser (included)
- See full documentation: https://github.com/animeprints/portfolioanalyzer#readme
- Check error logs in hPanel if issues

### For Developers:

- Source code: https://github.com/animeprints/portfolioanalyzer
- Rebuild package: `./create-release.sh`
- Customize: Edit source files in repo, then rebuild
```

---

## Automated Release (with GitHub CLI)

If you install GitHub CLI (`gh`), you can automate:

```bash
# Authenticate first
gh auth login

# Create release automatically
./github-release.sh
```

This will:
1. Build the package
2. Create a GitHub release with tag `v1.0.0`
3. Upload the ZIP as an asset
4. Include release notes

---

## After Creating Release

1. ✅ Update the `latest` release if needed
2. ✅ Share the download link: `https://github.com/animeprints/portfolioanalyzer/releases/download/v1.0.0/cardzey-hostinger-release.zip`
3. ✅ Pin the release in GitHub (optional)
4. ✅ Update README.md if version changes

---

## Notes

- The `release/` folder in the repo is for developers who want to inspect or modify the package before building
- The ZIP on Releases is the official distribution package
- Keep the ZIP compressed for easy downloads (~3MB vs 13MB uncompressed)
- Always include proper release notes for users
