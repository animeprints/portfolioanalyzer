# CV Analyzer 3D - Immersive Resume Analysis

A revolutionary, fully immersive 3D CV/portfolio analyzer built with React, Three.js, and modern web technologies. Helps users create better resumes with AI-powered analysis, beautiful visualizations, and job matching - all client-side for maximum privacy.

## Features

### Core Functionality
- **CV Upload**: Support for PDF, DOCX, and TXT formats
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
- **PDF Export**: Generate beautiful PDF reports with all analysis results

### 3D Immersive Experience
- Animated particle system background
- Floating geometric shapes with smooth motion
- Interactive 3D visualizations (skills network, timeline, score globe)
- Glassmorphism UI with neon effects
- Smooth page transitions and micro-interactions
- Dark theme optimized for visual impact

### Technical Highlights
- **100% Client-side**: All processing in browser, no data sent to servers
- **React 19** with TypeScript for type safety
- **Three.js / React Three Fiber** for stunning 3D graphics
- **Framer Motion** for buttery smooth animations
- **Tailwind CSS** for modern, responsive styling
- **Zustand** for lightweight state management
- **PDF parsing**: pdf.js for PDFs, mammoth.js for DOCX
- **PDF generation**: jsPDF with html2canvas

## Tech Stack

### Frontend
- React 19 + TypeScript
- Vite (build tool)
- React Router DOM (routing)
- Three.js + React Three Fiber + Drei (3D graphics)
- Framer Motion (animations)
- Tailwind CSS (styling)
- Zustand (state management)
- Lucide React (icons)

### CV Processing (Browser-native)
- pdfjs-dist (PDF parsing)
- mammoth (DOCX to text)
- jspdf + html2canvas (PDF report generation)

## Project Structure

```
src/
├── components/
│   ├── 3D/
│   │   ├── ParticleBackground.tsx
│   │   └── FloatingGeometry.tsx
│   ├── UI/
│   │   ├── GlassCard.tsx
│   │   ├── NeonButton.tsx
│   │   ├── FileUpload.tsx
│   │   └── JobMatchCard.tsx
├── pages/
│   ├── UploadPage.tsx
│   └── DashboardPage.tsx
├── store/
│   └── useStore.ts
├── utils/
│   ├── cvParser.ts
│   ├── analysisEngine.ts
│   ├── jobMatcher.ts
│   └── pdfExporter.ts
├── App.tsx
├── main.tsx
└── index.css
```

## Getting Started

### Prerequisites
- Node.js 20+ recommended (current: 18.19.1 - works but may show warnings)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:3000`

## Usage

1. **Upload Your CV**
   - Drag and drop a PDF, DOCX, or TXT file
   - Or click to browse and select

2. **View Analysis**
   - See your overall CV score in an interactive 3D dashboard
   - Explore detailed breakdowns across 4 metrics
   - Review extracted skills and personal information
   - Read personalized feedback on strengths and improvements

3. **Job Matching**
   - Add job descriptions (title, requirements)
   - Get instant match scores
   - View matched and missing skills
   - Receive actionable recommendations

4. **Export Report**
   - Download a comprehensive PDF report
   - Share with career coaches or mentors

## State Management

Zustand store handles:
- Current CV analysis results
- Job descriptions and match results
- User profile (future: localStorage persistence)
- Loading states

All data persists in localStorage automatically.

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

- [ ] User accounts with persistent storage (backend)
- [ ] Advanced 3D visualizations (skills network graph, timeline)
- [ ] Multiple language support
- [ ] Interview preparation tips
- [ ] LinkedIn profile optimization
- [ ] Export to other formats (Word, HTML)
- [ ] Progressive Web App (PWA) support
- [ ] Dark/Light theme toggle
- [ ] Shareable analysis links

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

## Privacy

**All CV processing happens locally in your browser.** No data is transmitted to any server. The app is fully functional offline after initial load.

## License

ISC

## Credits

Built with ❤️ Rajeev Reddy
