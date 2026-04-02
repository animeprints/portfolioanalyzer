# Cardzey - AI-Powered CV Analyzer & Career Platform

🚀 **Easy to Deploy**: Download `cardzey-hostinger-release.zip` from [GitHub Releases](https://github.com/animeprints/portfolioanalyzer/releases) (3MB) or use the `release/` folder in this repo. Upload to Hostinger in minutes with no coding required!

**For non-technical users**:
1. Download ZIP from Releases page
2. Extract and upload via Hostinger File Manager
3. Fill in database details in `.env`
4. Done! See `README-DEPLOY.txt` (included) or `DEPLOY.html` (visual guide)

**For developers**: Use `release/` folder or run `./create-release.sh` to rebuild

A full-stack career platform with immersive 3D CV analysis, interview preparation, LinkedIn profile optimization, and interviewer portal. Built with React (frontend) and PHP (backend API) with MySQL database.

**Privacy-focused**: CV analysis works client-side without backend, or use cloud storage for accounts and persistence.

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
- **Job Matching**:
  - Compare CV against job descriptions
  - Match percentage calculation
  - Skills gap analysis
  - Personalized recommendations
- **PDF Export**: Generate beautiful PDF reports (client-side)
- **Cloud Storage** (optional): Save analyses to your account, access from any device

### User Authentication & Profiles
- Secure JWT-based authentication (register, login, refresh)
- Persistent user profiles with personal information
- CV history: View and manage all past analyses
- Role-based access: Candidates, Interviewers, Admins

### Interview Preparation
- Practice interview questions organized by categories
- Track your progress and performance
- Answer with AI feedback (coming soon)
- Timer mode for realistic simulation

### LinkedIn Profile Optimization
- Analyze your LinkedIn profile or create one from your CV
- Get personalized recommendations to improve visibility
- Keyword optimization for recruiters
- Headline and summary suggestions

### Interviewer Portal
- Create and manage job postings
- Search and filter candidates by skills, experience, scores
- View candidate profiles and shared analyses
- Track interview questions and candidate performance

### 3D Immersive Experience
- Animated particle system background
- Floating geometric shapes with smooth motion
- Interactive 3D visualizations (skills network, timeline, score globe)
- Glassmorphism UI with neon effects
- Smooth page transitions and micro-interactions
- Dark theme optimized for visual impact

### Internationalization (i18n)
- Multi-language support: English, Spanish, French, German, Chinese, Japanese
- Language switcher component
- All UI text translatable

### Progressive Web App (PWA)
- Installable on desktop and mobile
- Offline capability (cached assets)
- Native app-like experience

## Tech Stack

### Frontend
- **React 19** + TypeScript
- **Vite** (build tool) with PWA plugin
- **React Router DOM** (routing)
- **Three.js + React Three Fiber + Drei** (3D graphics)
- **Framer Motion** (animations)
- **Tailwind CSS** (styling)
- **Zustand** (state management)
- **i18next** (internationalization)
- **Axios** (HTTP client with interceptors)
- **Lucide React** (icons)

### Backend
- **PHP 8+** with Composer dependency manager
- **MySQL** database
- **JWT** (JSON Web Tokens) for authentication
- **Apache** web server with mod_rewrite

### CV Processing
**Client-side:**
- pdfjs-dist (PDF parsing)
- mammoth (DOCX to text)
- jspdf + html2canvas (PDF report generation)

**Server-side:**
- pdftotext command-line utility for robust PDF parsing
- Custom PHP CV parser with skill extraction algorithms

### APIs
- RESTful JSON API with endpoints for:
  - Authentication (register, login, refresh)
  - CV analysis upload and retrieval
  - Profile management
  - Job postings (CRUD)
  - Candidate search
  - Interview questions
  - LinkedIn optimization analysis
  - Export (JSON, HTML, DOCX)
  - Share links (public access)

## Project Structure

```
cardzey/
├── deploy/                    # Deployment packages (pre-built, ready to upload)
│   └── hostinger/            # Complete Hostinger deployment package
│       ├── index.html        # Frontend entry
│       ├── assets/           # Compiled CSS/JS
│       ├── DEPLOY.html       # Visual deployment guide
│       └── backend/          # PHP API with all dependencies
├── backend/                   # PHP API backend
│   ├── config/              # Database & JWT config
│   ├── controllers/         # API controllers
│   ├── middleware/          # CORS, Auth, Role
│   ├── models/              # Data models
│   ├── utils/               # CV parser, analysis engine, helpers
│   ├── vendor/              # Composer dependencies (included)
│   ├── index.php            # API entry point
│   ├── install.sql          # Database schema
│   ├── .env.example         # Configuration template
│   └── .htaccess            # Apache rewrite rules
├── src/                      # Frontend React app (source)
│   ├── components/          # UI components (3D, Auth, Layout, etc.)
│   ├── pages/               # App pages and views
│   ├── services/            # API client modules
│   ├── hooks/               # Custom React hooks
│   ├── store/               # Zustand state management
│   ├── utils/               # Client-side utilities
│   ├── i18n/                # Internationalization
│   ├── App.tsx, main.tsx    # React entry points
│   └── index.css            # Global styles
├── dist/                    # Build output (not tracked, regenerated)
├── package.json             # Node dependencies
├── vite.config.ts           # Vite build configuration
├── tailwind.config.js       # Tailwind CSS config
├── tsconfig.json            # TypeScript config
├── DEPLOYMENT.md            # Full deployment documentation
├── QUICK-START-HOSTINGER.md # Quick reference
├── DEPLOYMENT-INSTRUCTIONS.txt # Simple non-technical guide
└── README.md                # This file
```

## 🚀 Quick Deploy (Non-Technical Users)

**Easiest way**: Use the pre-built Hostinger package.

1. **Download** `deploy/hostinger/` from this repository
2. **Open** `deploy/hostinger/DEPLOY.html` in your browser for visual instructions
3. **Or read** `DEPLOYMENT-INSTRUCTIONS.txt` for simple numbered steps
4. **Upload** files to Hostinger via File Manager
5. **Configure** the `.env` file with your database details
6. **Done!** Your CV Analyzer is live

**Full documentation**: See `QUICK-START-HOSTINGER.md` or `DEPLOYMENT.md`

---

## 🛠️ For Developers

### Prerequisites
- **Frontend**: Node.js 20+ and npm
- **Backend**: PHP 8+, MySQL, Composer
- **Server**: Apache with mod_rewrite (Hostinger has this)

### Local Development

1. **Clone and install**:
```bash
git clone https://github.com/animeprints/portfolioanalyzer.git
cd portfolioanalyzer
npm install
```

2. **Set up backend**:
```bash
cd backend
composer install
cp .env.example .env
# Edit .env with your local DB credentials
```

3. **Create database**:
   - Import `backend/install.sql` into MySQL
   - Note database name, username, password

4. **Configure frontend**:
   Create `.env` in project root:
   ```env
   VITE_API_URL=http://localhost:8000/api
   ```

5. **Start development servers**:
   - Backend: `cd backend && php -S localhost:8000` (or use Apache localhost)
   - Frontend: `npm run dev` → http://localhost:3000

6. Open the app and start developing!

---

## 📦 Build for Production

```bash
npm run build
```

This creates the `dist/` folder with optimized static files.

**Option A**: Use pre-built package (recommended for deployment)
- The repo includes `deploy/hostinger/` with everything ready to upload
- Built automatically on every commit

**Option B**: Build your own package
```bash
npm run build
./deploy-hosting.sh  # Creates fresh deploy/hostinger/ package
```

---

## Backend API

The PHP backend provides:
- **Authentication**: JWT-based register/login/refresh
- **CV Analysis**: Upload, parse, analyze PDFs/DOCX/TXT
- **User Profiles**: Manage personal info and analysis history
- **Job Management**: Create jobs, search candidates (interviewer role)
- **LinkedIn Optimization**: Analyze and improve LinkedIn profiles
- **Export**: JSON, HTML, DOCX formats
- ** sharing**: Password-protected public links

**Endpoints**: All under `/api/` (e.g., `/api/auth/register`, `/api/analysis/upload`)

**See**: `backend/README.md` for full API documentation

## Usage

### For Candidates

1. **Create Account** (optional but recommended for saving analyses)
   - Register at `/register` or login at `/login`
2. **Upload Your CV**
   - Drag and drop a PDF, DOCX, or TXT file on the Upload page
   - Or browse and select
3. **View Analysis**
   - See your overall CV score in an interactive 3D dashboard
   - Explore detailed breakdowns across 4 metrics
   - Review extracted skills, personal info, and summary
   - Read personalized feedback on strengths and improvements
4. **Save & Manage**
   - Analyses are saved to your account (if logged in)
   - Access past analyses from the dashboard history
   - Edit profile information
5. **Job Matching** (optional)
   - Add job descriptions (title, requirements)
   - Get instant match scores
   - View matched and missing skills
   - Receive actionable recommendations
6. **LinkedIn Optimization** (optional)
   - Navigate to `/linkedin`
   - Analyze your LinkedIn profile or create one from your CV
   - Get suggestions for improvement
7. **Export Report**
   - Download a comprehensive PDF report
   - Or export as JSON/HTML/DOCX (backend enabled)
8. **Share Analysis**
   - Share a read-only link with mentors or recruiters
   - Optionally protect with password

### For Interview Preparation

1. Navigate to `/interview` (requires login)
2. Choose a question category
3. Practice answering with timer and AI feedback (coming soon)
4. Track your progress and strengths/weaknesses

### For Interviewers

1. Register with interviewer role (contact admin for role assignment)
2. Access `/interviewer` portal
3. Create and manage job postings
4. Search candidates by skills, scores, experience
5. View candidate profiles and shared analyses
6. Manage interview questions and track candidate performance

## State Management

- **Frontend state**: React hooks and Zustand store for UI state (theme, UI preferences)
- **Authentication**: JWT tokens stored in browser localStorage with automatic refresh
- **Persistent data**: MySQL database via backend API
- **Client-side cache**: Analyses cached in IndexedDB/localStorage for offline access

## Customization

### Colors & Theme
Edit `tailwind.config.js` to customize:
- Color palette
- Fonts
- Animations
- Gradients

### 3D Effects
Modify `src/components/3D/ParticleBackground.tsx`:
- Particle count, color, size, speed
- Add more floating geometries in `FloatingGeometry.tsx`
- Implement additional 3D visualizations

### Analysis Engine
Extend `src/utils/analysisEngine.ts`:
- Add new skill categories
- Refine scoring algorithms
- Improve skill extraction logic

## Future Enhancements

- Light theme toggle (currently dark-only)
- Export in additional formats: HTML, DOCX, JSON (backend API ready)
- Email notifications (password reset, job alerts)
- Admin panel for user and content management
- Advanced candidate matching and ranking algorithms
- Real-time messaging between candidates and interviewers
- Server-side PDF generation with custom branding
- API documentation with Swagger UI
- Comprehensive unit and integration test suite
- CI/CD pipeline for automated testing and deployment
- Additional language support beyond current 6
- Advanced 3D visualizations: skills network graph, experience timeline

## 🚀 Deployment

**For non-technical users**: We've made deployment incredibly easy!

1. Download the `deploy/hostinger/` folder from this repository
2. Open `deploy/hostinger/DEPLOY.html` in your browser for visual step-by-step guide
3. Or follow `DEPLOYMENT-INSTRUCTIONS.txt` (plain English, numbered steps)
4. Upload files to Hostinger via File Manager (no command line needed)
5. Configure `.env` with your database credentials
6. Done! Your CV Analyzer is live

**For developers**:
- See `DEPLOYMENT.md` for comprehensive deployment guide
- See `QUICK-START-HOSTINGER.md` for quick reference
- Run `./deploy-hosting.sh` to build and create fresh deployment package

**What's included in `deploy/hostinger/`:**
- ✅ Complete frontend (index.html, assets, PWA)
- ✅ Backend PHP API with all dependencies (`vendor/` included)
- ✅ `.htaccess` files for routing
- ✅ Database schema (`install.sql`)
- ✅ Full documentation (README-HOSTINGER.md, DEPLOY.html)

**Target hosting**: Hostinger shared hosting (works on any PHP 7.4+ MySQL host)

---

## 🏗️ Development Commands

```bash
# Install dependencies
npm install

# Development server (frontend only)
npm run dev

# Build for production
npm run build

# Create deployment package (optional)
./deploy-hosting.sh
```

---

## 📖 Documentation

| Document | Audience | Description |
|----------|----------|-------------|
| `DEPLOYMENT-INSTRUCTIONS.txt` | Non-technical | Simple 8-step guide in plain English |
| `deploy/hostinger/DEPLOY.html` | Non-technical | Beautiful visual guide (open in browser) |
| `QUICK-START-HOSTINGER.md` | Technical | 3-step quick reference |
| `deploy/hostinger/README-HOSTINGER.md` | Technical | Detailed instructions with troubleshooting |
| `DEPLOYMENT.md` | Developers | Comprehensive deployment documentation |
| `COMPLETE-SUMMARY.md` | Everyone | Overview of all changes and improvements |

---

## 🔒 Security Notes

⚠️ **Important**: Before deploying, please:

1. **Rotate database password** - If you're using the example credentials from the repo, change them immediately in your hosting control panel
2. **Generate strong JWT secret**:
   ```bash
   openssl rand -hex 32
   ```
   Use this in `backend/.env` as `JWT_SECRET`
3. **Configure ALLOWED_ORIGINS** - Set to your actual domain in `.env`
4. **Keep `.env` private** - Never commit or share this file

The repository's `.env` files are ignored by Git, but old commits may contain placeholder credentials.

---

## Performance Notes

- PDF.js worker loaded from CDN for efficient parsing
- 3D scenes optimized with instancing and LODs
- Smooth 60fps target on modern devices
- Responsive design for all screen sizes
- PWA with offline caching (service worker)

---

## Browser Support

- **Chrome/Edge** (recommended, full 3D support)
- **Firefox** (good 3D support)
- **Safari** (partial 3D support, all features work)
- **Mobile browsers** (optimized touch interactions)

---

## Privacy & Data Handling

- **Client-side mode**: When not logged in or offline, CV parsing and analysis happen entirely in your browser. No data leaves your device.
- **Online mode**: When backend is configured, CVs are uploaded to the server for analysis and storage. Data is kept secure in a MySQL database.
- **Shared analyses**: Public links can be generated with optional password protection.
- **Authentication**: JWT tokens stored in browser localStorage; never shared with third parties.
- **Data deletion**: You can delete your account and all associated data at any time via account settings or by contacting the administrator.

---

## License

ISC

---

## Credits

Built with ❤️ by Rajeev Reddy

**Technologies**: React, Three.js, TypeScript, Vite, Tailwind CSS, PHP, MySQL, JWT

---

## 📞 Support

- Check error logs in your hosting control panel
- Review the deployment documentation (`DEPLOYMENT.md`)
- Open an issue on GitHub for bugs or feature requests
