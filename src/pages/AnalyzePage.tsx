import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
  Upload, FileText, X, Award, TrendingUp, Target, CheckCircle,
  BarChart3, FileDown, RefreshCw, Sparkles, Brain, Zap, Shield
} from 'lucide-react';
import { analysisAPI } from '../services';
import { AnalysisResult } from '../services/index';

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        setError(null);
      }
    },
  });

  const handleAnalyze = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await analysisAPI.upload(file);
      setResult(response.data.analysis);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError(null);
  };

  const handleExport = async () => {
    alert('Export feature coming soon!');
  };

  const getScore = (value: number | undefined, fallback: number = 0) => value ?? fallback;

  // Get category color
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Technical': 'text-violet-400',
      'Soft Skills': 'text-gold-400',
      'Business': 'text-blue-400',
      'Languages': 'text-green-400',
      'Tools': 'text-orange-400',
    };
    return colors[category] || 'text-silver-400';
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-sm font-semibold mb-6">
            <Brain className="w-4 h-4" />
            AI-Powered Analysis
          </div>

          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            Decode Your CV's
            <span className="block text-gold-gradient mt-2">Hidden Potential</span>
          </h1>

          <p className="text-xl text-silver-400 max-w-2xl mx-auto leading-relaxed">
            Upload your resume and receive surgical precision analysis. Discover strengths,
            identify blind spots, and optimize with data-driven insights.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Upload State */}
          {!result && !isAnalyzing && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              className="max-w-2xl mx-auto"
            >
              <div
                {...getRootProps()}
                data-testid="dropzone"
                className={`
                  card-glass p-16 text-center cursor-pointer transition-all duration-500
                  ${isDragActive ? 'dropzone-active scale-[1.02]' : ''}
                `}
              >
                <input {...getInputProps()} data-testid="file-input" />

                {file ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-4"
                  >
                    <div className="w-20 h-20 rounded-2xl bg-gold-500/15 flex items-center justify-center border-2 border-gold-500/30">
                      <FileText className="w-10 h-10 text-gold-400" />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-white text-lg mb-1">{file.name}</p>
                      <p className="text-sm text-silver-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleReset(); }}
                      className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all"
                      aria-label="Remove file"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-28 h-28 rounded-2xl bg-gold-500/5 border-2 border-dashed border-gold-500/30 flex items-center justify-center mb-8 animate-float">
                      <Upload className="w-14 h-14 text-gold-400" />
                    </div>
                    <h3 className="text-2xl font-display font-bold text-white mb-3">
                      {isDragActive ? 'Drop Your CV' : 'Upload Your Resume'}
                    </h3>
                    <p className="text-silver-400 mb-8 max-w-md">
                      Supports PDF, DOCX, and TXT formats. Your data is processed securely and privately.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6 text-sm">
                      {['PDF', 'DOCX', 'TXT'].map((format) => (
                        <span key={format} className="flex items-center gap-2 text-silver-400">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          {format}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-6 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-center"
                  role="alert"
                >
                  {error}
                </motion.div>
              )}

              <motion.button
                onClick={handleAnalyze}
                disabled={!file || isAnalyzing}
                whileTap={{ scale: 0.98 }}
                className={`
                  w-full mt-10 py-5 px-6 rounded-xl font-semibold text-lg
                  flex items-center justify-center gap-3
                  transition-all duration-300
                  ${!file
                    ? 'bg-silver-800/50 text-silver-500 cursor-not-allowed'
                    : 'btn-gold shadow-glow'
                  }
                `}
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5" />
                    Analyze resume
                  </>
                )}
              </motion.button>
            </motion.div>
          )}

          {/* Analyzing State */}
          {isAnalyzing && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto"
            >
              <div className="card-glass p-16 text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  className="w-40 h-40 mx-auto mb-8 relative"
                >
                  <div className="absolute inset-0 rounded-full border-4 border-gold-500/20" />
                  <div className="absolute inset-3 rounded-full border-4 border-gold-500/30 animate-pulse" />
                  <div className="absolute inset-6 rounded-full border-4 border-transparent border-t-gold-500 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-10 h-10 text-gold-400 animate-pulse" />
                  </div>
                </motion.div>

                <h2 className="text-3xl font-display font-bold text-white mb-3">
                  Processing Your CV
                </h2>
                <p className="text-silver-400 mb-10 text-lg">
                  Our AI is extracting insights and calculating scores...
                </p>

                <div className="grid grid-cols-2 gap-6 max-w-md mx-auto text-left">
                  {[
                    'Parsing document',
                    'Extracting skills',
                    'Calculating scores',
                    'Generating report'
                  ].map((step, i) => (
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.6 }}
                      className="flex items-center gap-3 p-4 rounded-xl bg-surface/50"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.6 }}
                        className="w-2 h-2 rounded-full bg-gold-400"
                      />
                      <span className="text-silver-300 text-sm">{step}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Results State */}
          {result && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="space-y-10"
            >
              {/* Success Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-semibold mb-4">
                  <CheckCircle className="w-4 h-4" />
                  Analysis Complete
                </div>
                <h2 className="text-3xl font-display font-bold text-white mb-2">
                  Your CV Intelligence Report
                </h2>
                <p className="text-silver-400">
                  Comprehensive insights based on millions of successful profiles
                </p>
              </motion.div>

              {/* Score Cards */}
              <section className="grid md:grid-cols-2 gap-8">
                {/* Overall Score */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="card-glass p-10"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-gold-500/15 flex items-center justify-center">
                      <Award className="w-6 h-6 text-gold-400" />
                    </div>
                    <h3 className="text-2xl font-display font-bold text-white">Overall Score</h3>
                  </div>

                  <div className="mb-8">
                    <div className="flex justify-between items-end mb-4">
                      <span className="text-silver-400 font-medium">Performance</span>
                      <div className="flex items-baseline gap-2">
                        <motion.span
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="text-6xl font-display font-bold text-gold-400"
                        >
                          {getScore(result.overall_score)}%
                        </motion.span>
                      </div>
                    </div>
                    <div className="h-3 bg-surface/50 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${getScore(result.overall_score)}%` }}
                        transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
                        className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-400 shadow-glow"
                      />
                    </div>
                  </div>

                  {/* Mini scores */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'ATS', value: getScore(result.ats_score), color: 'emerald', icon: TrendingUp },
                      { label: 'Readability', value: getScore(result.readability_score), color: 'violet', icon: Target },
                      { label: 'Impact', value: getScore(result.impact_score), color: 'blue', icon: BarChart3 },
                      { label: 'Completeness', value: getScore(result.completeness_score), color: 'amber', icon: CheckCircle },
                    ].map(({ label, value, color, icon: Icon }) => (
                      <div
                        key={label}
                        className="p-4 rounded-xl bg-surface/50 border border-white/5"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className={`w-4 h-4 text-${color}-400`} />
                          <span className="text-sm text-silver-400">{label}</span>
                        </div>
                        <div className={`text-2xl font-bold text-${color}-400`}>
                          {value}%
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Skills Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="card-glass p-10"
                >
                  <h3 className="text-2xl font-display font-bold text-white mb-6">
                    Skill Distribution
                  </h3>

                  <div className="space-y-6">
                    {Object.entries(result.extracted_skills || {}).map(([category, skills]) => (
                      skills.length > 0 && (
                        <div key={category}>
                          <div className="flex justify-between items-center mb-3">
                            <span className={`text-sm font-semibold capitalize ${getCategoryColor(category)}`}>
                              {category}
                            </span>
                            <span className="text-sm text-silver-500">{skills.length} skills</span>
                          </div>
                          <div className="h-2 bg-surface/50 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(skills.length / 20) * 100}%` }}
                              transition={{ duration: 1, ease: 'easeOut' }}
                              className="h-full bg-gradient-to-r from-gold-500/60 to-gold-400/60"
                            />
                          </div>
                        </div>
                      )
                    ))}
                  </div>

                  <div className="mt-10 pt-8 border-t border-white/5">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-silver-400 text-sm">Total Skills</span>
                      <span className="text-3xl font-display font-bold text-gold-400">
                        {Object.values(result.extracted_skills || {}).flat().length}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Skills Breakdown */}
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="card-glass p-10"
              >
                <h3 className="text-2xl font-display font-bold text-white mb-8">
                  Skills Detected
                </h3>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(result.extracted_skills || {}).map(([category, skills]: [string, string[]]) => (
                    <div key={category} className="p-6 rounded-xl bg-surface/40 border border-white/5">
                      <h4 className={`text-lg font-semibold capitalize mb-4 ${getCategoryColor(category)}`}>
                        {category}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {skills && skills.length > 0 ? (
                          skills.map((skill: string) => (
                            <span
                              key={skill}
                              className="skill-badge"
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <p className="text-silver-500 text-sm italic">No {category} skills detected</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>

              {/* Extracted Info */}
              {(result.personal_info?.name || result.personal_info?.email || result.personal_info?.linkedin) && (
                <motion.section
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="card-glass p-10"
                >
                  <h3 className="text-2xl font-display font-bold text-white mb-8">
                    Extracted Information
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {result.personal_info?.name && (
                      <div>
                        <p className="text-sm text-silver-500 mb-2 uppercase tracking-wider text-xs">Name</p>
                        <p className="font-semibold text-white text-lg">{result.personal_info.name}</p>
                      </div>
                    )}
                    {result.personal_info?.email && (
                      <div>
                        <p className="text-sm text-silver-500 mb-2 uppercase tracking-wider text-xs">Email</p>
                        <p className="font-semibold text-white text-lg">{result.personal_info.email}</p>
                      </div>
                    )}
                    {result.personal_info?.phone && (
                      <div>
                        <p className="text-sm text-silver-500 mb-2 uppercase tracking-wider text-xs">Phone</p>
                        <p className="font-semibold text-white text-lg">{result.personal_info.phone}</p>
                      </div>
                    )}
                    {result.personal_info?.linkedin && (
                      <div>
                        <p className="text-sm text-silver-500 mb-2 uppercase tracking-wider text-xs">LinkedIn</p>
                        <p className="font-semibold text-gold-400 text-lg">{result.personal_info.linkedin}</p>
                      </div>
                    )}
                  </div>
                </motion.section>
              )}

              {/* Recommendations */}
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="card-glass p-10"
              >
                <h3 className="text-2xl font-display font-bold text-white mb-6">
                  AI Recommendations
                </h3>
                {result.summary ? (
                  <p className="text-silver-300 leading-relaxed text-lg">{result.summary}</p>
                ) : (
                  <ul className="space-y-4">
                    {[
                      'Add quantifiable achievements to demonstrate impact',
                      'Include relevant keywords from target job descriptions',
                      'Structure experience in reverse-chronological order',
                      'Add a professional summary at the top',
                      'Highlight leadership and initiative in past roles',
                    ].map((rec, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + i * 0.1 }}
                        className="flex items-start gap-4 p-4 rounded-xl bg-surface/40"
                      >
                        <div className="w-8 h-8 rounded-full bg-gold-500/15 flex items-center justify-center mt-0.5 flex-shrink-0">
                          <Sparkles className="w-4 h-4 text-gold-400" />
                        </div>
                        <span className="text-silver-300">{rec}</span>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </motion.section>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="flex flex-col sm:flex-row gap-5 justify-center pt-8"
              >
                <motion.button
                  onClick={() => window.location.href = '/jobs'}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-gold inline-flex items-center justify-center gap-3 px-10 py-5 text-lg"
                >
                  <Target className="w-5 h-5" />
                  Match with Jobs
                </motion.button>
                <motion.button
                  onClick={handleExport}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-10 py-5 rounded-xl bg-surface/50 backdrop-blur-sm border border-white/10 text-white font-semibold hover:bg-surface/70 hover:border-gold-500/30 transition-all text-lg flex items-center justify-center gap-3"
                >
                  <FileDown className="w-5 h-5" />
                  Export Report
                </motion.button>
                <motion.button
                  onClick={handleReset}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-10 py-5 rounded-xl bg-surface/30 border border-white/5 text-silver-300 font-semibold hover:bg-surface/50 transition-all text-lg flex items-center justify-center gap-3"
                >
                  <RefreshCw className="w-5 h-5" />
                  Analyze Another
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
