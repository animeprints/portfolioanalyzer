# CV Analyzer - Deployment Guide (Hostinger Only)

## Overview

This project is configured for **Hostinger-only deployment**:
- **Frontend**: React + Vite static site
- **Backend**: PHP API
- **Database**: MySQL
- **Target Hosting**: Hostinger shared hosting (all-in-one)

## What's Implemented

### ✅ Backend (PHP + MySQL)
- JWT Authentication (register, login, refresh)
- CV upload, parsing, and analysis
- Profile management
- Job posting management (interviewer role)
- Candidate search and filtering
- Interview questions bank and practice tracking
- LinkedIn profile optimization analysis
- Export endpoints (JSON, HTML, DOCX)
- Shareable analysis links with optional password protection
- Full database schema with MySQL
- CORS configuration for Vercel frontend

### ✅ Frontend Enhancements
- Authentication pages (Login, Register)
- Protected routes with role-based access
- API integration layer (services)
- CV analysis service with server upload
- Profile service
- Job service for interviewers
- Candidate search service
- Interview, LinkedIn services
- Share service
- CV history selector on dashboard
- Updated Dashboard to load analyses from server
- Interviewer portal: Dashboard, Jobs listing, Job edit, Candidate search pages
- Language switcher component (UI ready)
- PWA configuration (Vite plugin)

### ✅ Infrastructure
- i18n setup with 6 languages (en, es, fr, de, zh, ja)
- PWA manifest and service worker configuration
- Vite PWA plugin configured

## Files Created

### Backend (`/backend`)
- `index.php` - API entry point with routing
- `.htaccess` - Apache rewrite rules
- `composer.json` - PHP dependencies
- `.env.example` - Environment template
- `install.sql` - Database schema
- `README.md` - Backend documentation
- `config/database.php` - DB connection
- `config/jwt.php` - JWT utilities
- `middleware/auth.php` - JWT auth middleware
- `middleware/role.php` - Role-based access
- `middleware/cors.php` - CORS handling
- `controllers/AuthController.php`
- `controllers/AnalysisController.php`
- `controllers/ProfileController.php`
- `controllers/JobController.php`
- `controllers/CandidateController.php`
- `controllers/InterviewController.php`
- `controllers/LinkedinController.php`
- `controllers/ExportController.php`
- `controllers/ShareController.php`
- `models/User.php`
- `models/Profile.php`
- `utils/Response.php`
- `utils/CVParser.php`
- `utils/AnalysisEngine.php`
- `data/seed_interview_questions.sql`

### Frontend (`/src`)
- `services/api.ts` - Axios client with interceptors
- `services/authService.ts` - Auth API
- `services/analysisService.ts` - CV analysis
- `services/profileService.ts` - User profile
- `services/interviewService.ts` - Interview prep
- `services/linkedinService.ts` - LinkedIn optimizer
- `services/exportService.ts` - Export formats
- `services/shareService.ts` - Share links
- `services/candidateService.ts` - Candidate search
- `hooks/useAuth.ts` - Authentication hook
- `components/Auth/ProtectedRoute.tsx` - Route guard
- `pages/LoginPage.tsx` - Login form
- `pages/RegisterPage.tsx` - Registration form
- `pages/SharedAnalysisPage.tsx` - Public shared view
- `pages/Interviewer/DashboardPage.tsx` - Interviewer dashboard
- `pages/Interviewer/JobsPage.tsx` - Job listings
- `pages/Interviewer/JobEditPage.tsx` - Create/Edit job
- `pages/Interviewer/CandidatesPage.tsx` - Candidate search
- `i18n/` - Internationalization setup with 6 languages

### Updates to Existing Files
- `package.json` - Added i18next, vite-plugin-pwa dependencies
- `vite.config.ts` - Added PWA plugin
- `src/App.tsx` - Added auth routes and interviewer routes
- `src/pages/UploadPage.tsx` - Now uses server API
- `src/pages/DashboardPage.tsx` - Loads analyses from server, added history selector
- `src/main.tsx` - Import i18n initialization

## Deployment Steps

### 1. Backend (Hostinger)

1. Create MySQL database via Hostinger hPanel
2. Import `backend/install.sql` using phpMyAdmin
3. Upload entire `backend/` folder to hosting (e.g., `public_html/api/`)
4. Set permissions: `upload/` must be writable (755)
5. If SSH available: run `composer install` in backend folder
   - If no SSH: run `composer install` locally and upload `vendor/` folder
6. Copy `backend/.env.example` to `backend/.env`
7. Edit `.env` with:
   ```env
   DB_HOST=localhost
   DB_NAME=your_db_name
   DB_USER=your_db_user
   DB_PASS=your_db_password
   JWT_SECRET=generate-random-32-char-hex
   ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-domain.com
   ```
8. Test API: `https://your-domain.com/api/` should show API docs

### 2. Frontend (Hostinger)

Frontend is pre-built in `deploy/hostinger/` with static assets.

**Option A: Upload via Hostinger File Manager (Recommended)**
1. Go to hPanel → Files → File Manager
2. Navigate to `public_html/`
3. Upload all files from `deploy/hostinger/` **EXCEPT** the `backend/` folder
4. These files go directly in `public_html/`:
   - `index.html`
   - `assets/` folder
   - `sw.js`, `manifest.webmanifest`, `.htaccess`, etc.

**Option B: Deploy fresh build**
```bash
npm run build
# Then upload dist/ contents to Hostinger public_html/
```

**Same-domain setup** (frontend + backend on same domain):
- No environment variable needed
- Frontend automatically uses `/api` endpoint

**Separate subdomain setup** (e.g., `app.yourdomain.com` frontend, `api.yourdomain.com` backend):
- Rebuild frontend with: `VITE_API_URL=https://api.yourdomain.com npm run build`
- Upload both to their respective locations

### 3. CORS & Security

- Ensure `.env` on backend has correct `ALLOWED_ORIGINS`
- Use HTTPS both frontend and backend
- JWT_SECRET must be strong and kept secret

## Testing Checklist

- [ ] Backend health endpoint returns JSON at `/api/`
- [ ] Can register new user via API (Postman or frontend)
- [ ] Can login and receive JWT tokens
- [ ] Can upload CV and get analysis
- [ ] Can list analyses from dashboard
- [ ] Can create job posting as interviewer
- [ ] Can search candidates (with filters)
- [ ] Can share analysis and view via public link
- [ ] Frontend loads at `https://yourdomain.com`
- [ ] Can login through frontend
- [ ] Can upload CV and see analysis
- [ ] Can see CV history and switch between analyses
- [ ] Can navigate to Interviewer Dashboard (`/interviewer`)
- [ ] Can create job posting
- [ ] Can search candidates
- [ ] PWA install prompt appears (after manifest)
- [ ] All assets load correctly (CSS, JS, images)
- [ ] API calls succeed (check browser console for CORS errors)

## Future Enhancements (Not Yet Implemented)

- Full light theme styling (infrastructure present)
- Interview prep page frontend (backend API ready)
- LinkedIn optimizer frontend page
- Export service integration (backend ready)
- Email sending (password reset, notifications)
- Admin panel for user management
- Advanced candidate matching and ranking
- Real-time messaging
- PDF server-side generation with styling
- Rate limiting on API
- API documentation with Swagger UI
- Unit tests
- CI/CD pipeline

## Notes

### CV Parsing
Server-side PDF parsing uses `pdftotext` command. Ensure it's available on Hostinger. If not, install or use alternative PHP library. The fallback simple extraction may be limited.

### File Uploads
Uploaded CV files are stored in `backend/upload/`. Ensure this directory exists and is writable. For security, consider storing outside web root.

### JWT
Access tokens expire in 15 minutes (configurable). Refresh tokens last 7 days. Store tokens in localStorage on frontend.

### Role-Based Access
Roles: `candidate`, `interviewer`, `admin`. Assign role during registration. Interviewer can access `/interviewer/*` routes.

### Database
MySQL schema provided in `install.sql`. All tables use InnoDB with foreign keys.

### Error Handling
API returns JSON with `{ success, data, error }`. Check `success` field.

---

## 📦 Quick Deploy Package

A ready-to-deploy package is in `deploy/hostinger/`:

**Contents:**
- Frontend static files (`index.html`, `assets/`, PWA files)
- `.htaccess` for SPA routing
- Complete backend PHP API with vendor dependencies
- Backend `.env.example`

**Deployment:**
1. Upload `deploy/hostinger/` contents to Hostinger
2. Frontend → `public_html/` (root files only)
3. Backend → `public_html/api/` (complete `backend/` folder)
4. Configure `public_html/api/.env` with DB credentials
5. Import `public_html/api/install.sql` via phpMyAdmin

See `deploy/hostinger/README-HOSTINGER.md` for detailed steps.

---

**Contact**: For issues, check logs and consult backend README.
