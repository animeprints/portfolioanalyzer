# ✅ Hostinger Migration Complete

## What Was Done

### 1. Security Cleanup
- ✅ Removed hardcoded database credentials from `backend/config/database.php`
- ✅ Deleted 413 unnecessary files (old deployment dirs, test files, zip archives)
- ✅ Fixed: Database config now requires environment variables only (no fallbacks)
- ⚠️ **Important**: Database credentials were in Git history. You must **rotate your DB password** immediately on Hostinger.

### 2. Vercel Removal
- ✅ Deleted `vercel.json` (Vercel build configuration)
- ✅ Updated frontend API client to support same-domain deployment
- ✅ No Vercel-specific files remain in repository

### 3. Hostinger Deployment Package
Created `deploy/hostinger/` with everything needed:

```
deploy/hostinger/
├── index.html                    # Frontend SPA entry
├── assets/                       # Compiled CSS/JS
├── sw.js + manifest.webmanifest  # PWA files
├── .htaccess                     # Frontend SPA routing
├── README-HOSTINGER.md           # Detailed deployment guide
└── backend/                      # Complete PHP API
    ├── index.php
    ├── .htaccess
    ├── .env.example              # Config template
    ├── vendor/                   # Dependencies pre-installed
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── utils/
    └── upload/                   # For CV files (make writable)
```

### 4. Configuration Changes
- **Frontend** (`src/services/api.ts`): Now uses relative `/api` path by default in production (works on same domain)
- **Backend** (`.env.example`): Updated with clearer Hostinger-specific defaults
- **Documentation** (`DEPLOYMENT.md`): Rewritten for Hostinger-only deployment

---

## 🚀 How to Deploy to Hostinger

### Quick Deploy (5 Steps)

1. **Create MySQL database** on Hostinger hPanel
2. **Upload files**:
   - `deploy/hostinger/` frontend files → `public_html/`
   - `deploy/hostinger/backend/` → `public_html/api/`
3. **Configure backend**:
   - Copy `public_html/api/.env.example` to `.env`
   - Add your DB credentials (host, name, user, pass)
   - Generate JWT_SECRET: `openssl rand -hex 32`
   - Set ALLOWED_ORIGINS to your domain
4. **Import database schema**:
   - phpMyAdmin → Import `public_html/api/install.sql`
5. **Test**:
   - Visit `https://yourdomain.com/` (frontend)
   - Visit `https://yourdomain.com/api/` (backend health check)

### Detailed Guide
See `deploy/hostinger/README-HOSTINGER.md` for complete instructions including SSH setup, troubleshooting, and SSL.

---

## 🔐 Critical Security Steps

### MUST DO Before Deployment:

1. **Rotate Database Password** (credentials exposed in old Git commits)
   - Change password in Hostinger database settings
   - Update `public_html/api/.env` with new password

2. **Generate Strong JWT Secret**:
   ```bash
   openssl rand -hex 32
   ```
   Add to `.env`

3. **Set Correct ALLOWED_ORIGINS**:
   ```env
   ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
   ```

4. **Secure upload/ directory**:
   ```bash
   chmod 755 upload/
   ```

---

## 📁 Files Changed

### Modified
- `src/services/api.ts` - Auto-same-domain support
- `backend/.env.example` - Hostinger-friendly defaults
- `DEPLOYMENT.md` - Complete rewrite for Hostinger

### Removed
- `vercel.json` - Vercel config deleted

### Added
- `deploy/hostinger/` - Complete deployment package (150+ files)
- `deploy/hostinger/.htaccess` - Frontend SPA routing
- `deploy/hostinger/README-HOSTINGER.md` - Deployment guide

---

## ❓ FAQ

**Q: Do I still need Vercel?**  
A: No. Entirely removed. Deploy everything to Hostinger.

**Q: Where do backend uploads go?**  
A: `public_html/api/upload/` (ensure this is writable: 755)

**Q: Can I use a subdomain for frontend?**  
A: Yes. Same `public_html/` works for root domain or subdomain.

**Q: What about pdftotext?**  
A: Hostinger usually has it. If CV parsing fails, use SSH to install or modify `CVParser.php`.

**Q: How to update after deployment?**  
A: Upload new frontend files + run `composer install` if dependencies changed.

---

## 📝 Notes

- **No Vercel**: All Vercel references removed
- **No history rewrite**: Your repo history is intact (so Vercel deploys would still work if you kept them)
- **Credentials**: DB password must be rotated (was in old commits)
- **PWA**: Service worker included, works on Hostinger
- **SSL**: Enable free SSL in Hostinger hPanel

---

**Need Help?** Check `deploy/hostinger/README-HOSTINGER.md` for detailed troubleshooting.
