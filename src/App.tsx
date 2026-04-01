import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ParticleBackground from './components/3D/ParticleBackground';
import UploadPage from './pages/UploadPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SharedAnalysisPage from './pages/SharedAnalysisPage';
import InterviewerDashboardPage from './pages/Interviewer/DashboardPage';
import InterviewerJobsPage from './pages/Interviewer/JobsPage';
import InterviewerJobEditPage from './pages/Interviewer/JobEditPage';
import InterviewerCandidatesPage from './pages/Interviewer/CandidatesPage';
import ProtectedRoute from './components/Auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="relative min-h-screen">
        {/* 3D Background - show only on main pages, not on auth? */}
        <Routes>
          {/* Public routes - no 3D background */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Public shared analysis - no auth required */}
          <Route path="/shared/:token" element={<SharedAnalysisPage />} />

          {/* Protected routes with 3D background */}
          <Route
            path="/"
            element={
              <div className="relative min-h-screen">
                <ParticleBackground count={1500} color="#06b6d4" size={0.03} speed={0.5} />
                <UploadPage />
              </div>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div className="relative min-h-screen">
                  <ParticleBackground count={1500} color="#06b6d4" size={0.03} speed={0.5} />
                  <DashboardPage />
                </div>
              </ProtectedRoute>
            }
          />

          {/* Interviewer routes */}
          <Route
            path="/interviewer"
            element={
              <ProtectedRoute allowedRoles={['interviewer', 'admin']}>
                <div className="relative min-h-screen">
                  <ParticleBackground count={1500} color="#06b6d4" size={0.03} speed={0.5} />
                  <InterviewerDashboardPage />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/interviewer/jobs"
            element={
              <ProtectedRoute allowedRoles={['interviewer', 'admin']}>
                <div className="relative min-h-screen">
                  <ParticleBackground count={1500} color="#06b6d4" size={0.03} speed={0.5} />
                  <InterviewerJobsPage />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/interviewer/jobs/:id"
            element={
              <ProtectedRoute allowedRoles={['interviewer', 'admin']}>
                <div className="relative min-h-screen">
                  <ParticleBackground count={1500} color="#06b6d4" size={0.03} speed={0.5} />
                  <InterviewerJobEditPage />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/interviewer/candidates"
            element={
              <ProtectedRoute allowedRoles={['interviewer', 'admin']}>
                <div className="relative min-h-screen">
                  <ParticleBackground count={1500} color="#06b6d4" size={0.03} speed={0.5} />
                  <InterviewerCandidatesPage />
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </div>
    </Router>
  );
}

export default App;
