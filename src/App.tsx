import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import ParticleBackground from './components/3D/ParticleBackground';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Layout/Navbar';
import ScrollProgress from './components/ScrollProgress';
import CustomCursor from './components/CustomCursor';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { PageTransition } from './components/EnhancedUI/PageTransition';
import { cn } from './utils/cn';
import { GrainOverlay, GradientBackground } from './components/Effects';

// Pages
import HomePage from './pages/HomePage';
import WorkPage from './pages/WorkPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AnalyzePage from './pages/AnalyzePage';
import DashboardPage from './pages/DashboardPage';
import JobMatchPage from './pages/JobMatchPage';
import InterviewPage from './pages/InterviewPage';
import LinkedInPage from './pages/LinkedInPage';

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <div className="w-16 h-16 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Layout wrapper with effects
function AppLayout({
  children,
  withParticle = true,
  withCursor = false,
  withNavbar = true,
}: {
  children: React.ReactNode;
  withParticle?: boolean;
  withCursor?: boolean;
  withNavbar?: boolean;
}) {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {withCursor && isAuthenticated && <CustomCursor />}
      <div className="relative min-h-screen">
        {withNavbar && <Navbar />}
        {withParticle && isAuthenticated && <ParticleBackground count={800} color="#06b6d4" size={0.02} speed={0.3} />}
        {withParticle && !isAuthenticated && (
          <GradientBackground intensity="moderate" animated={true}>
            <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
          </GradientBackground>
        )}
        <ScrollProgress />
        <GrainOverlay opacity={0.02} />
        <main className="relative z-10">{children}</main>
      </div>
    </>
  );
}

function AppRoutes() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <div className="w-16 h-16 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
        <Route
          path="/"
          element={
            <AppLayout withNavbar={true} withParticle={true}>
              <PageTransition>
                <HomePage />
              </PageTransition>
            </AppLayout>
          }
        />
        <Route
          path="/about"
          element={
            <AppLayout withNavbar={true} withParticle={true}>
              <PageTransition>
                <AboutPage />
              </PageTransition>
            </AppLayout>
          }
        />
        <Route
          path="/work"
          element={
            <AppLayout withNavbar={true} withParticle={true}>
              <PageTransition>
                <WorkPage />
              </PageTransition>
            </AppLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <AppLayout withNavbar={true} withParticle={false}>
              <PageTransition>
                <ContactPage />
              </PageTransition>
            </AppLayout>
          }
        />
        <Route
          path="/login"
          element={
            <AppLayout withNavbar={false} withParticle={false}>
              <PageTransition>
                <LoginPage />
              </PageTransition>
            </AppLayout>
          }
        />
        <Route
          path="/register"
          element={
            <AppLayout withNavbar={false} withParticle={false}>
              <PageTransition>
                <RegisterPage />
              </PageTransition>
            </AppLayout>
          }
        />

        {/* Protected routes - full immersive experience */}
        <Route
          path="/analyze"
          element={
            <ProtectedRoute>
              <AppLayout withNavbar={true} withParticle={true} withCursor={true}>
                <PageTransition>
                  <AnalyzePage />
                </PageTransition>
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout withNavbar={true} withParticle={true} withCursor={true}>
                <PageTransition>
                  <DashboardPage />
                </PageTransition>
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <AppLayout withNavbar={true} withParticle={true} withCursor={true}>
                <PageTransition>
                  <JobMatchPage />
                </PageTransition>
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/interview"
          element={
            <ProtectedRoute>
              <AppLayout withNavbar={true} withParticle={true} withCursor={true}>
                <PageTransition>
                  <InterviewPage />
                </PageTransition>
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/linkedin"
          element={
            <ProtectedRoute>
              <AppLayout withNavbar={true} withParticle={true} withCursor={true}>
                <PageTransition>
                  <LinkedInPage />
                </PageTransition>
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  );
}

function App() {
  useSmoothScroll({
    duration: 1.2,
  });

  return (
    <Router>
      <AuthProvider>
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public routes */}
            <Route
              path="/"
              element={
                <AppLayout withNavbar={true} withParticle={true}>
                  <PageTransition>
                    <HomePage />
                  </PageTransition>
                </AppLayout>
              }
            />
            <Route
              path="/about"
              element={
                <AppLayout withNavbar={true} withParticle={true}>
                  <PageTransition>
                    <AboutPage />
                  </PageTransition>
                </AppLayout>
              }
            />
            <Route
              path="/work"
              element={
                <AppLayout withNavbar={true} withParticle={true}>
                  <PageTransition>
                    <WorkPage />
                  </PageTransition>
                </AppLayout>
              }
            />
            <Route
              path="/contact"
              element={
                <AppLayout withNavbar={true} withParticle={false}>
                  <PageTransition>
                    <ContactPage />
                  </PageTransition>
                </AppLayout>
              }
            />
            <Route
              path="/login"
              element={
                <AppLayout withNavbar={false} withParticle={false}>
                  <PageTransition>
                    <LoginPage />
                  </PageTransition>
                </AppLayout>
              }
            />
            <Route
              path="/register"
              element={
                <AppLayout withNavbar={false} withParticle={false}>
                  <PageTransition>
                    <RegisterPage />
                  </PageTransition>
                </AppLayout>
              }
            />

            {/* Protected routes - full immersive experience */}
            <Route
              path="/analyze"
              element={
                <ProtectedRoute>
                  <AppLayout withNavbar={true} withParticle={true} withCursor={true}>
                    <PageTransition>
                      <AnalyzePage />
                    </PageTransition>
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AppLayout withNavbar={true} withParticle={true} withCursor={true}>
                    <PageTransition>
                      <DashboardPage />
                    </PageTransition>
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/jobs"
              element={
                <ProtectedRoute>
                  <AppLayout withNavbar={true} withParticle={true} withCursor={true}>
                    <PageTransition>
                      <JobMatchPage />
                    </PageTransition>
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/interview"
              element={
                <ProtectedRoute>
                  <AppLayout withNavbar={true} withParticle={true} withCursor={true}>
                    <PageTransition>
                      <InterviewPage />
                    </PageTransition>
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/linkedin"
              element={
                <ProtectedRoute>
                  <AppLayout withNavbar={true} withParticle={true} withCursor={true}>
                    <PageTransition>
                      <LinkedInPage />
                    </PageTransition>
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </AuthProvider>
    </Router>
  );
}

export default App;
