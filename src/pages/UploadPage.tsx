import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import FileUpload from '../components/UI/FileUpload'
import { parseFile } from '../utils/cvParser'
import { analyzeCV } from '../utils/analysisEngine'
import { useStore } from '../store/useStore'
import { Sparkles, Zap, Shield, BarChart3 } from 'lucide-react'

export default function UploadPage() {
  const navigate = useNavigate()
  const { setCurrentAnalysis, setLoading } = useStore()
  const [error, setError] = useState<string | undefined>(undefined)

  const handleFileSelect = async (file: File) => {
    setError(undefined)
    setLoading(true)

    try {
      // Parse the file
      const parsed = await parseFile(file)

      // Analyze CV
      const analysis = analyzeCV(parsed.text)

      // Store analysis
      setCurrentAnalysis(analysis)

      // Navigate to dashboard
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to analyze CV')
      setLoading(false)
    }
  }

  const features = [
    {
      icon: Sparkles,
      title: 'Smart Analysis',
      description: 'AI-powered analysis extracts skills, experience, and provides actionable insights'
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Get comprehensive feedback in seconds with beautiful visualizations'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'All processing happens locally in your browser. No data leaves your device.'
    },
    {
      icon: BarChart3,
      title: 'Job Matching',
      description: 'Compare your CV against job descriptions and get match scores'
    }
  ]

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative z-10">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
        {/* Left side - Hero text */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              <span className="text-white">Supercharge Your</span>
              <br />
              <span className="gradient-text">Career Story</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Unlock your CV's full potential with our immersive 3D analyzer.
              Get personalized insights, skill recommendations, and beat the ATS.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right side - Upload card */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <FileUpload onFileSelect={handleFileSelect} isLoading={false} error={error} />
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-10 left-10 text-gray-500 text-sm">
        Built with React • Three.js • AI
      </div>
    </div>
  )
}
