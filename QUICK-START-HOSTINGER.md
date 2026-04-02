# 🚀 Quick Start: Deploy to Hostinger

## Pre-Deployment Checklist

- [ ] Create MySQL database on Hostinger
- [ ] Generate JWT secret: `openssl rand -hex 32`
- [ ] Have your domain ready (e.g., yourdomain.com)

---

## 3-Step Deployment

### 1️⃣ Upload Files

**Via Hostinger File Manager:**
- Upload **frontend**: All files from `deploy/hostinger/` EXCEPT `backend/` folder → `public_html/`
- Upload **backend**: `deploy/hostinger/backend/` folder → `public_html/api/`

**Result:**
```
public_html/
├── index.html
├── assets/
├── .htaccess
└── api/
    ├── index.php
    ├── .env.example
    └── ...
```

---

### 2️⃣ Configure Backend

```bash
# SSH into Hostinger (or use File Manager)
cd public_html/api/
cp .env.example .env
nano .env   # or use File Manager editor
```

Edit these values:
```env
DB_NAME=your_hostinger_db_name
DB_USER=your_hostinger_db_user
DB_PASS=your_hostinger_db_password
JWT_SECRET=your_generated_32_char_hex
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

**Tip**: Keep defaults for other settings unless you know what you're changing.

---

### 3️⃣ Setup Database

1. Go to hPanel → Databases → phpMyAdmin
2. Select your database
3. Click **Import** → Choose file
4. Upload: `public_html/api/install.sql`
5. Click **Go**

---

## ✅ Test Deployment

| Test | URL | Expected |
|------|-----|----------|
| Frontend loads | `https://yourdomain.com` | CV Analyzer homepage |
| Backend health | `https://yourdomain.com/api/` | "CV Analyzer API" message |
| Register user | `https://yourdomain.com/api/auth/register` (POST) | JSON with user data |
| Login | `https://yourdomain.com/api/auth/login` (POST) | JSON with tokens |

**Still stuck?** See full guide: `DEPLOYMENT.md` or `deploy/hostinger/README-HOSTINGER.md`

---

## 🔐 Post-Deployment Security

- [x] Rotate DB password (if old one was ever committed)
- [x] Generate strong JWT_SECRET
- [x] Set correct ALLOWED_ORIGINS
- [ ] Enable SSL (free in hPanel → Security)
- [ ] Set file permissions: `755` for dirs, `644` for files
- [ ] Ensure `api/upload/` is writable (755)

---

## 🆘 Common Issues

| Issue | Solution |
|-------|----------|
| 500 Error | Check `api/.env` exists and has correct DB credentials |
| CORS errors | Update ALLOWED_ORIGINS in `.env` to match your domain |
| Upload fails | Ensure `api/upload/` exists and is writable (755) |
| CSS/JS not loading | Verify `.htaccess` is in `public_html/` |
| PDF parsing fails | Hostinger usually has `pdftotext`. If not, use alternative parser |

---

## 📞 Need Help?

1. **Backend logs**: hPanel → Metrics → Error Log
2. **Full guide**: `DEPLOYMENT.md`
3. **Detailed Hostinger guide**: `deploy/hostinger/README-HOSTINGER.md`
