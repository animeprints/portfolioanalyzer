# Cardzey - AI-Powered Career Development Platform

A revolutionary, full-stack career platform featuring immersive 3D CV analysis, interview preparation, LinkedIn profile optimization, and an interviewer portal. Built with React, Three.js, PHP, and MySQL.

Privacy-focused design: CV analysis can be performed entirely client-side, while optional backend services provide user accounts, cloud storage, and advanced features.

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
├── .claude/                   # Claude Code memory
├── backend/                   # PHP API backend
│   ├── config/               # Database and JWT configuration
│   │   ├── database.php
│   │   └── jwt.php
│   ├── controllers/          # API controllers (Auth, Analysis, Profile, Job, etc.)
│   ├── middleware/           # CORS, Auth, Role middleware
│   ├── models/               # Data models
│   ├── utils/                # Response helper, CV parser, analysis engine
│   ├── upload/               # Uploaded CV files (writable)
│   ├── vendor/               # Composer dependencies
│   ├── index.php             # API entry point
│   ├── install.sql           # Database schema
│   ├── .htaccess             # Apache rewrite rules
│   └── README.md             # Backend documentation
├── src/                      # Frontend React app
│   ├── components/
│   │   ├── 3D/               # 3D graphics and effects
│   │   ├── Auth/             # Authentication components (ProtectedRoute)
│   │   ├── Landing/          # Landing page specific components
│   │   ├── Layout/           # Navbar, layout wrappers
│   │   └── UI/               # Reusable UI components (GlassCard, NeonButton, etc.)
│   │   └── ErrorBoundary.tsx
│   ├── pages/
│   │   ├── LandingPage.tsx        # Home page with 3D showcase
│   │   ├── UploadPage.tsx         # CV upload
│   │   ├── DashboardPage.tsx      # CV analysis results
│   │   ├── ProfilePage.tsx        # User profile management
│   │   ├── LinkedInPage.tsx       # LinkedIn profile optimizer
│   │   ├── InterviewPage.tsx      # Interview preparation
│   │   ├── LoginPage.tsx          # Login form
│   │   ├── RegisterPage.tsx       # Registration form
│   │   ├── SharedAnalysisPage.tsx # Public shared view
│   │   └── Interviewer/           # Recruiter portal
│   │       ├── DashboardPage.tsx
│   │       ├── JobsPage.tsx
│   │       ├── JobEditPage.tsx
│   │       └── CandidatesPage.tsx
│   ├── services/             # API service modules (auth, analysis, profile, etc.)
│   ├── hooks/                # Custom React hooks (useAuth, etc.)
│   ├── store/                # Zustand store
│   │   └── useStore.ts
│   ├── utils/                # Client-side CV parsing, analysis algorithms (fallback)
│   ├── i18n/                 # Internationalization config and translations
│   ├── App.tsx               # Main app component with routing
│   ├── main.tsx              # Entry point
│   └── index.css             # Global styles
├── public/                   # Static assets
├── dist/                     # Build output
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── DEPLOYMENT.md             # Comprehensive deployment guide
└── README.md                 # This file
```

## Getting Started

### Prerequisites
- **Frontend**: Node.js 20+ and npm
- **Backend**: PHP 8+, MySQL, Composer

### Quick Start (Development)

1. **Clone and install**:
```bash
git clone <repo>
cd cardzey
npm install
```

2. **Set up backend** (see [Backend Setup](#backend-setup) below or DEPLOYMENT.md)

3. **Configure environment**:
   - Create `.env` in project root with `VITE_API_URL=https://your-backend.test/api` (or local API URL)

4. **Start development servers**:
   - Backend: Deploy to local server or use PHP built-in server (see backend/README.md)
   - Frontend: `npm run dev` (default: http://localhost:3000)

5. Access the app and start exploring!

### Backend Setup

The backend is a PHP + MySQL API. See `backend/README.md` and `DEPLOYMENT.md` for full instructions.

Quick steps:

1. Create MySQL database and import `backend/install.sql`
2. Configure `backend/.env` with DB credentials and JWT secret
3. Install PHP dependencies: `cd backend && composer install`
4. Deploy backend to a PHP-enabled server (e.g., Hostinger shared hosting) or use local server with Apache/Nginx
   - Ensure `backend/upload/` directory is writable
5. Set `VITE_API_URL` in frontend `.env` to point to your backend API

### Production Build

```bash
npm run build
```

Deploy the `dist/` folder to Vercel or static hosting, and the backend to a PHP host.

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

## Performance Notes

- PDF.js worker is loaded from CDN for efficient parsing
- 3D scenes are optimized with instancing and LODs
- Smooth 60fps target on modern devices
- Responsive design for all screen sizes

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari (partial 3D support)
- Mobile browsers (optimized touch interactions)

## Privacy & Data Handling

- **Client-side mode**: When not logged in or offline, CV parsing and analysis happen entirely in your browser. No data leaves your device.
- **Online mode**: When backend is configured, CVs are uploaded to the server for analysis and storage. Data is kept secure in a MySQL database.
- **Shared analyses**: Public links can be generated with optional password protection.
- **Authentication**: JWT tokens stored in browser localStorage; never shared with third parties.
- **Data deletion**: You can delete your account and all associated data at any time via account settings or by contacting the administrator.

## License

ISC

## Credits

Built with ❤️ Rajeev Reddy
