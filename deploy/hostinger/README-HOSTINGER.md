# CV Analyzer - Hostinger Deployment Guide

## 📦 Package Contents

```
deploy/hostinger/
├── index.html              # Frontend SPA entry point
├── assets/                 # Compiled CSS/JS/PWA files
├── sw.js                   # Service worker (PWA)
├── manifest.webmanifest    # PWA manifest
├── .htaccess               # Frontend routing rules
└── backend/                # PHP API backend
    ├── index.php           # API entry point
    ├── .htaccess           # API rewrite rules
    ├── .env.example        # Environment template
    ├── composer.json
    ├── composer.lock
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── utils/
    ├── upload/             # User uploaded files (ensure writable)
    └── vendor/             # PHP dependencies (pre-installed)
```

---

## 🚀 Deployment Steps

### **Step 1: Prepare Your Hostinger Account**

1. Log into Hostinger hPanel
2. Create a **MySQL database**:
   - Note down: Database name, username, password
3. (Optional) Set up a domain/subdomain
   - Recommended: `cv.yourdomain.com` or `yourdomain.com`

---

### **Step 2: Upload Files via FTP or File Manager**

**Option A: Using Hostinger File Manager (recommended)**
1. Go to hPanel → Files → File Manager
2. Navigate to `public_html/`
3. Upload **frontend** files:
   - Upload all files from `deploy/hostinger/` EXCEPT the `backend/` folder
   - Place them directly in `public_html/`
4. Upload **backend** files:
   - Create folder `public_html/api/`
   - Upload contents of `deploy/hostinger/backend/` to `public_html/api/`

**Option B: Using FTP**
```bash
# Frontend to public_html/
ftp> cd public_html
ftp> put -r index.html assets/ .htaccess sw.js manifest.webmanifest

# Backend to public_html/api/
ftp> mkdir api
ftp> cd api
ftp> put -r backend/*
```

---

### **Step 3: Configure Backend**

1. **Create `.env` file** in `public_html/api/`:
   ```bash
   cd public_html/api/
   cp .env.example .env
   ```

2. **Edit `.env`** with your Hostinger database credentials:
   ```env
   DB_HOST=localhost
   DB_NAME=your_actual_db_name
   DB_USER=your_actual_db_user
   DB_PASS=your_actual_db_password
   DB_CHARSET=utf8mb4

   JWT_SECRET=generate-a-random-32-char-hex-string
   JWT_ALGORITHM=HS256
   JWT_EXPIRES_IN=900
   JWT_REFRESH_EXPIRES_IN=604800

   API_ENV=production
   ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

   MAX_FILE_SIZE=10485760
   UPLOAD_DIR=upload
   ```

   **How to generate JWT_SECRET:**
   ```bash
   openssl rand -hex 32
   ```

3. **Ensure upload directory is writable**:
   ```bash
   chmod 755 upload/
   ```

---

### **Step 4: Set Up Database**

1. Go to hPanel → Databases → phpMyAdmin
2. Select your database
3. Click **Import** → Choose file → Upload `backend/install.sql`
4. Click **Go** to import schema

---

### **Step 5: Composer Dependencies**

**If you have SSH access:**
```bash
cd public_html/api/
composer install --no-dev
```

**If no SSH (most shared hosting):**
- Run `composer install --no-dev` locally on your machine
- Upload the entire updated `vendor/` folder to `public_html/api/vendor/`

---

### **Step 6: Test the API**

1. Visit: `https://yourdomain.com/api/`
   - Should see "CV Analyzer API" message
2. Test registration: `https://yourdomain.com/api/auth/register`
   - Use Postman or curl
3. If errors, check Hostinger error logs in hPanel

---

### **Step 7: Update Frontend Configuration**

**If frontend and backend are on the same domain:**
- No changes needed! The frontend automatically uses `/api` route

**If frontend is on a different domain/subdomain:**
1. Set environment variable in Hostinger:
   - hPanel → Advanced → Cron Jobs or use `.env` file
   - Create file `public_html/.env` with:
   ```env
   VITE_API_URL=https://api.yourdomain.com
   ```
   *(Note: Vite requires rebuild if this changes)*

---

### **Step 8: SSL Certificate**

- Enable free SSL in Hostinger hPanel → Security → SSL
- Force HTTPS redirect in hPanel

---

## 🔧 Troubleshooting

### **500 Internal Server Error**
- Check PHP error logs in hPanel
- Ensure `.env` file exists in `public_html/api/`
- Verify file permissions (755 for folders, 644 for files)
- Ensure `vendor/` folder exists

### **CORS Issues**
- Edit `public_html/api/.env`
- Update `ALLOWED_ORIGINS` to include your frontend URL
- Clear any caching

### **Upload Fails**
- Ensure `public_html/api/upload/` exists and is writable (755)
- Check `php.ini` upload limits if needed

### **PWA Not Working**
- Ensure `.htaccess` exists in `public_html/`
- Check that `sw.js` is accessible at `/sw.js`

---

## 📝 Notes

- **PHP Version**: Requires PHP 7.4+ (Hostinger default is fine)
- **MySQL**: Hostinger provides MySQL 5.7+
- **pdftotext**: Usually available on Hostinger. If CV parsing fails, install via SSH or use alternative.
- **Email**: Configure SMTP in `.env` for password reset

---

## 🔄 Update Process

1. Upload new frontend files to `public_html/`
2. Update backend API in `public_html/api/`
3. Run `composer install --no-dev` if `composer.json` changed
4. Clear cache if any

---

**Need help?** Check backend README.md for API details.
