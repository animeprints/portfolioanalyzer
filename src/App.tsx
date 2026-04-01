import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import ParticleBackground from './components/3D/ParticleBackground'
import UploadPage from './pages/UploadPage'
import DashboardPage from './pages/DashboardPage'

function App() {
  return (
    <Router>
      <div className="relative min-h-screen">
        {/* 3D Background */}
        <ParticleBackground count={1500} color="#06b6d4" size={0.03} speed={0.5} />

        {/* Main Content */}
        <Routes>
          <Route path="/" element={<UploadPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
