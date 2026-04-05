# Cardzey - AI-Powered CV Analyzer & Career Platform

🚀 **Easy to Deploy**: Run `./deploy-hosting.sh` to build and generate a ready-to-upload package for Hostinger (or any PHP/MySQL host). Upload `deploy/hostinger/` contents and you're live in minutes!

**For non-technical users**:
1. Download the latest release from GitHub Releases
2. Extract and upload via Hostinger File Manager or FTP
3. Fill in database details in `api/.env`
4. Done! See `deploy/hostinger/DEPLOY.html` for visual guide

**For developers**: Run `./deploy-hosting.sh` to build and create a fresh deployment package

A professional career platform with AI-powered CV analysis, interview preparation, LinkedIn profile optimization, and interviewer portal. Built with React (frontend) and PHP (backend API) with MySQL database.

**Privacy-focused**: CV analysis works client-side without backend, or use cloud storage for accounts and persistence.

---

## ✨ What's New (2024 Redesign)

- **Complete Professional UI Redesign**: Clean, flat design with Inter font and accessible color palette ( navy/blue + orange accents)
- **Fixed AI CV Analyzer**: Critical PHP bug fixes and API response transformation
- **Working 2D Skill Visualization**: Replaced broken 3D globe with reliable SVG radial chart
- **Professional Dashboard**: Stats cards, analysis history, quick actions
- **Accessible Auth Pages**: Login and registration with proper validation
- **Production Ready**: Zero TypeScript errors, passing build, full test coverage

---

## Features

### Core CV Analysis
- **CV Upload**: Support for PDF, DOCX, and TXT formats (client-side or server-side)
- **Smart Analysis**: AI-powered extraction and evaluation of:
  - Skills (technical, soft, business, languages, tools)
  - Experience level (years, positions, seniority)
  - Education detection
  - Personal information (email, phone, LinkedIn, GitHub)
  - Contact completeness
  - Summary extraction
- **Scoring System**:
  - Overall score (0-100)
  - ATS compatibility score
  - Readability score
  - Impact score
  - Completeness score
- **Job Matching**: Compare CV against job descriptions with match percentage and skill gap analysis
- **Cloud Storage**: Save analyses to your account, access from any device

### User Authentication & Profiles
- Secure JWT-based authentication (register, login, refresh)
- Persistent user profiles with personal information
- CV history: View and manage all past analyses
- Role-based access: Candidates, Interviewers, Admins

### Interview Preparation
- Practice interview questions organized by categories
- Track your progress and performance
- Timer mode for realistic simulation

### LinkedIn Profile Optimization
- Analyze your LinkedIn profile or create one from your CV
- Get personalized recommendations to improve visibility
- Keyword optimization for recruiters

### Interviewer Portal
- Create and manage job postings
- Search and filter candidates by skills, experience, scores
- View candidate profiles and shared analyses
- Track interview questions and candidate performance

### Progressive Web App (PWA)
- Installable on desktop and mobile
- Offline capability (cached assets)
- Native app-like experience

---

## Tech Stack

### Frontend
- React 19 + TypeScript
- Vite (build tool) with PWA plugin
- React Router DOM (routing)
- Framer Motion (animations)
- Tailwind CSS (styling)
- Axios (HTTP client)
- Lucide React (icons)

### Backend
- PHP 8+ with Composer
- MySQL database
- JWT (JSON Web Tokens) for authentication
- Apache web server with mod_rewrite

### CV Processing
- **Server-side**: pdftotext CLI, custom PHP parser with skill extraction
- **Client-side** (optional): PDF.js, mammoth.js for in-browser parsing

---

## Quick Start (Development)

### Prerequisites
- Node.js 20+ and npm
- PHP 8+, MySQL, Composer

### Setup

1. **Clone and install dependencies**:
```bash
git clone https://github.com/animeprints/portfolioanalyzer.git
cd portfolioanalyzer
npm install
```

2. **Set up backend**:
```bash
cd api
composer install
cp .env.example .env
# Edit .env with your local DB credentials
```

3. **Create database**:
   - Import `api/install.sql` into MySQL
   - Note database name, username, password

4. **Configure frontend**:
   Create `.env` in project root:
```env
VITE_API_URL=http://localhost:8000/api
```

5. **Start development servers**:
   - Backend: `cd api && php -S localhost:8000`
   - Frontend: `npm run dev` → http://localhost:3000

6. Open the app and start developing!

---

## Production Build & Deployment

### Build for Production
```bash
npm run build
```

This creates the `dist/` folder with optimized static files.

### Create Deployment Package (Hostinger Ready)
```bash
./deploy-hosting.sh
```

This script:
1. Builds the frontend (`npm run build`)
2. Creates `deploy/hostinger/` with all necessary files
3. Includes backend API with Composer dependencies
4. Generates `DEPLOY.html` (visual guide) and documentation

### Deploy to Hostinger (or any PHP host)

**Option A: Using File Manager** (easiest)
1. Open `deploy/hostinger/` folder
2. Upload ALL contents to `public_html/` via Hostinger File Manager
3. Navigate to `public_html/api/`, copy `.env.example` to `.env`
4. Fill in database credentials and JWT secret
5. In hPanel → Databases, create a MySQL database
6. In phpMyAdmin, import `install.sql`
7. Done! Visit your domain

**Option B: Using FTP**
1. Connect via FTP (FileZilla, etc.)
2. Upload contents of `deploy/hostinger/` to `public_html/`
3. Configure `api/.env` with database credentials
4. Import database via phpMyAdmin

**See**: `deploy/hostinger/DEPLOY.html` for detailed visual guide with screenshots.

---

## Project Structure

```
cardzey/
├── src/                      # Frontend React app (source)
│   ├── components/          # UI components
│   ├── pages/              # App pages and views
│   ├── services/           # API client modules
│   ├── contexts/           # React contexts (Auth)
│   ├── utils/              # Client-side utilities
│   ├── App.tsx, main.tsx   # React entry points
│   └── index.css           # Global styles
├── api/                     # PHP API backend
│   ├── config/             # Database & JWT config
│   ├── controllers/        # API controllers
│   ├── middleware/         # Auth, Role
│   ├── models/             # Data models
│   ├── utils/              # CV parser, analysis engine
│   ├── vendor/             # Composer dependencies
│   ├── index.php           # API entry point
│   └── install.sql         # Database schema
├── deploy/                 # Deployment scripts and packages
│   └── hostinger/         # Generated deployment package (gitignored)
├── dist/                  # Build output (gitignored)
├── design-system/         # Design system documentation
├── node_modules/          # Node dependencies
├── package.json           # Node dependencies
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
```

---

## API Endpoints

All endpoints are under `/api/`:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/register` | POST | Register new user |
| `/auth/login` | POST | Login user |
| `/auth/refresh` | POST | Refresh JWT token |
| `/auth/me` | GET | Get current user |
| `/analysis/upload` | POST | Upload and analyze CV |
| `/analysis` | GET | List user's analyses |
| `/analysis/{id}` | GET | Get specific analysis |
| `/analysis/{id}` | DELETE | Delete analysis |
| `/profile` | GET | Get user profile |
| `/profile` | PUT | Update profile |
| `/jobs` | POST | Create job posting (interviewers) |
| `/candidates/search` | POST | Search candidates (interviewers) |
| `/interview/questions` | GET | Get interview questions |
| `/interview/practice` | POST | Record practice answer |
| `/linkedin/analyze` | POST | Analyze LinkedIn profile |
| `/export` | POST | Export analysis (PDF/JSON/HTML/DOCX) |

---

## Design System

The project follows a **Professional Flat Design** system:

- **Colors**: Primary navy (#2563EB), secondary blue (#3B82F6), CTA orange (#F97316)
- **Typography**: Inter font family (clean, readable, professional)
- **Spacing**: 4px grid system (4, 8, 16, 24, 32, 48, 64)
- **Components**: Flat cards with subtle shadows, rounded corners (8-12px)
- **Accessibility**: WCAG AA compliant (contrast ratios ≥4.5:1)
- **Responsive**: Mobile-first breakpoints (375px, 768px, 1024px, 1440px)

See `design-system/cardzey/MASTER.md` for complete design specifications.

---

## Key Improvements Made

### Bug Fixes
- ✅ Fixed PHP syntax error in `CVParser::extractName()` (was using JavaScript `.length`)
- ✅ Transform backend response to match frontend expectations (snake_case camelCase conversion)
- ✅ Fixed TypeScript errors across all pages
- ✅ Replaced broken 3D SkillGlobe with working 2D SVG visualization
- ✅ Added missing component index exports

### UI/UX Redesign
- ✅ Complete visual redesign with professional flat aesthetic
- ✅ Accessible color palette with proper contrast
- ✅ Consistent spacing and typography
- ✅ Proper loading states and error handling
- ✅ Mobile-responsive layouts
- ✅ Clean, intuitive navigation

### Code Quality
- ✅ TypeScript strict mode compliant
- ✅ Production build passes with zero errors
- ✅ Consistent API response shapes
- ✅ Proper error boundaries and fallbacks

---

## Browser Support

- Chrome/Edge (recommended, full support)
- Firefox (full support)
- Safari (full support)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Security Notes

⚠️ **Before deploying**:

1. **Rotate JWT secret**: Generate a strong random secret:
```bash
openssl rand -hex 32
```
Update `api/.env` with `JWT_SECRET=your_generated_secret`

2. **Change database credentials**: Use strong passwords, not the defaults

3. **Keep `.env` private**: Never commit or share this file. The repo includes `.env.example` as a template.

---

## License

ISC

---

## Credits

Built with ❤️ by Rajeev Reddy

**Technologies**: React, TypeScript, Tailwind CSS, Vite, PHP, MySQL, JWT

---

## Support

- Check error logs in your hosting control panel
- Review the deployment guide (`deploy/hostinger/DEPLOY.html`)
- Open an issue on GitHub for bugs or feature requests
