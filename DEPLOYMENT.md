# CV Analyzer - Deployment Guide

## Overview

This project consists of:
- **Frontend**: React + Vite app deployed to Vercel
- **Backend**: PHP API deployed to Hostinger shared hosting
- **Database**: MySQL on Hostinger

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

### 2. Frontend (Vercel)

1. Push code to GitHub repository
2. Import project in Vercel
3. Set environment variable:
   - `VITE_API_URL` = `https://your-domain.com/api`
4. Deploy
5. Set custom domain in Vercel if desired

### 3. CORS & Security

- Ensure `.env` on backend has correct `ALLOWED_ORIGINS`
- Use HTTPS both frontend and backend
- JWT_SECRET must be strong and kept secret

## Testing Checklist

- [ ] Backend health endpoint returns JSON
- [ ] Can register new user via API (Postman)
- [ ] Can login and receive JWT tokens
- [ ] Can upload CV and get analysis
- [ ] Can list analyses
- [ ] Can create job posting as interviewer
- [ ] Can search candidates (with filters)
- [ ] Can share analysis and view via public link
- [ ] Frontend loads on Vercel
- [ ] Can login through Vercel frontend
- [ ] Can upload CV and see analysis
- [ ] Can see CV history and switch between analyses
- [ ] Can navigate to Interviewer Dashboard (`/interviewer`)
- [ ] Can create job posting
- [ ] Can search candidates
- [ ] Language switcher shows available languages (need to integrate)
- [ ] PWA install prompt appears (after manifest)

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

**Contact**: For issues, check logs and consult backend README.
