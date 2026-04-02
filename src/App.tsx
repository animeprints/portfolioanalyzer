import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ParticleBackground from './components/3D/ParticleBackground';
import LandingPage from './pages/LandingPage';
import UploadPage from './pages/UploadPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import TemplatesPage from './pages/TemplatesPage';
import LinkedInPage from './pages/LinkedInPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import InterviewPage from './pages/InterviewPage';
import SharedAnalysisPage from './pages/SharedAnalysisPage';
import InterviewerDashboardPage from './pages/Interviewer/DashboardPage';
import InterviewerJobsPage from './pages/Interviewer/JobsPage';
import InterviewerJobEditPage from './pages/Interviewer/JobEditPage';
import InterviewerCandidatesPage from './pages/Interviewer/CandidatesPage';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Navbar from './components/Layout/Navbar';

// Layout wrapper with Navbar and optional 3D background
function AppLayout({
  children,
  withParticle = false
}: {
  children: React.ReactNode;
  withParticle?: boolean;
}) {
  return (
    <div className="relative min-h-screen">
      <Navbar />
      {withParticle && <ParticleBackground count={1500} color="#06b6d4" size={0.03} speed={0.5} />}
      <main className="relative z-10 pt-16">{children}</main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes without navbar */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Public shared analysis - no navbar, no auth */}
        <Route path="/shared/:token" element={<SharedAnalysisPage />} />

        {/* Landing page - with navbar, no particles */}
        <Route
          path="/"
          element={
            <AppLayout>
              <LandingPage />
            </AppLayout>
          }
        />

        {/* App routes - with navbar and particles */}
        <Route
          path="/upload"
          element={
            <AppLayout withParticle>
              <UploadPage />
            </AppLayout>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout withParticle>
                <DashboardPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <AppLayout withParticle>
                <ProfilePage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/templates"
          element={
            <AppLayout withParticle={false}>
              <TemplatesPage />
            </AppLayout>
          }
        />

        <Route
          path="/linkedin"
          element={
            <ProtectedRoute>
              <AppLayout withParticle={false}>
                <LinkedInPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/interview"
          element={
            <ProtectedRoute>
              <AppLayout withParticle={false}>
                <InterviewPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Interviewer routes - with navbar and particles */}
        <Route
          path="/interviewer"
          element={
            <ProtectedRoute allowedRoles={['interviewer', 'admin']}>
              <AppLayout withParticle>
                <InterviewerDashboardPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/interviewer/jobs"
          element={
            <ProtectedRoute allowedRoles={['interviewer', 'admin']}>
              <AppLayout withParticle>
                <InterviewerJobsPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/interviewer/jobs/:id"
          element={
            <ProtectedRoute allowedRoles={['interviewer', 'admin']}>
              <AppLayout withParticle>
                <InterviewerJobEditPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/interviewer/candidates"
          element={
            <ProtectedRoute allowedRoles={['interviewer', 'admin']}>
              <AppLayout withParticle>
                <InterviewerCandidatesPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Fallback - 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
