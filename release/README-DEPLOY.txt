╔═══════════════════════════════════════════════════════════════════╗
║           CV ANALYZER - HOSTINGER DEPLOYMENT PACKAGE            ║
╚═══════════════════════════════════════════════════════════════════╝

🎉 Congratulations! You have everything you need to deploy Cardzey.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 WHAT'S IN THIS PACKAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This folder contains a complete, ready-to-deploy web application:

  ✓ Frontend (React SPA) - static HTML/CSS/JS files
  ✓ Backend API (PHP) - complete with all dependencies
  ✓ Database schema - ready to import
  ✓ Configuration templates - just fill in your details
  ✓ .htaccess files - Apache routing rules
  ✓ Documentation - step-by-step guides

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 8-STEP DEPLOYMENT GUIDE (EASY)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Step 1: UPLOAD FILES
───────────────────
  • Log into Hostinger hPanel
  • Go to Files → File Manager
  • Navigate to public_html/
  • Upload ALL files from this folder EXCEPT the "backend/" folder
    → Place them directly in public_html/
  • Create folder: public_html/api/
  • Upload the "backend/" folder to public_html/api/

Step 2: CREATE DATABASE
──────────────────────
  • In hPanel, click "Databases"
  • Click "Create New Database"
  • Note these details:
    - Database Name: ___________
    - Username: _______________
    - Password: _______________

Step 3: CONFIGURE BACKEND
─────────────────────────
  • In File Manager, go to public_html/api/
  • Find file: .env.example
  • Click "Edit" and change:

    DB_NAME=your_database_name
    DB_USER=your_database_user
    DB_PASS=your_database_password
    JWT_SECRET=any-random-32-characters
    ALLOWED_ORIGINS=https://yourdomain.com

  • Save as: .env (without .example)

  💡 TIP: Generate JWT_SECRET here: https://www.uuidgenerator.net/version4
  Or use: openssl rand -hex 32

Step 4: IMPORT DATABASE
───────────────────────
  • Go to hPanel → Databases → phpMyAdmin
  • Select your database
  • Click "Import" tab
  • Choose file: public_html/api/install.sql
  • Click "Go"

Step 5: SET PERMISSIONS
──────────────────────
  • In File Manager, go to public_html/api/
  • Find folder: upload/
  • Right-click → Change Permissions
  • Set to: 755 (or check "Write" checkbox)
  • Click "Change"

Step 6: ENABLE HTTPS (SSL)
──────────────────────────
  • In hPanel, go to Security → SSL
  • Enable Free SSL Certificate
  • Enable Force HTTPS Redirect

Step 7: TEST YOUR SITE
──────────────────────
  Visit these URLs:

  https://yourdomain.com
    → Should see CV Analyzer homepage

  https://yourdomain.com/api/
    → Should see "CV Analyzer API"

  https://yourdomain.com/api/auth/register
    (POST with JSON) → Should create user

Step 8: YOU'RE DONE! 🎉
───────────────────────
  Your CV Analyzer is now live and ready to use!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔐 IMPORTANT SECURITY CHECKLIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before going live, please ensure:

  □ You CHANGED the database password from any defaults
  □ You generated a STRONG JWT_SECRET (32+ random characters)
  □ ALLOWED_ORIGINS in .env matches your actual domain
  □ SSL (HTTPS) is enabled (Step 6)
  □ .env file is kept private (never share it)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ TROUBLESHOOTING COMMON ISSUES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Problem: 500 Internal Server Error
Solution: Check that .env file exists in public_html/api/ and has correct
          database credentials. Also check error logs in hPanel.

Problem: CSS/JavaScript not loading
Solution: Ensure .htaccess file exists in public_html/ (this folder)

Problem: Upload/CV parsing fails
Solution: Set upload/ folder permissions to 755. Some hosts may not have
          pdftotext utility - in that case, use simpler PDFs.

Problem: CORS error in browser console
Solution: Edit .env and set ALLOWED_ORIGINS to include your full domain

Problem: API returns 404
Solution: Ensure .htaccess exists in public_html/api/ and mod_rewrite
          is enabled (Hostinger has it by default)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 NEED MORE HELP?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  • Check error logs: hPanel → Metrics → Error Log
  • Verify all steps are completed
  • Ensure vendor/ folder exists in api/ (it should)
  • Make sure PHP version is 7.4+ (Hostinger default is fine)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Made with ❤️ by Cardzey Team
Questions? Open an issue on GitHub.

EOF
