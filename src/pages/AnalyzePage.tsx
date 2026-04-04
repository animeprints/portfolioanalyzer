import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, Award, TrendingUp, Target, CheckCircle, BarChart3, FileDown, RefreshCw } from 'lucide-react';
import { analysisAPI } from '../services';
import { AnalysisResult } from '../services/index';
import SkillGlobe from '../components/3D/SkillGlobe';
import { useNavigate } from 'react-router-dom';

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<{ name: string; level: number; category: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

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
    setSelectedSkill(null);
  };

  const handleExport = async () => {
    // TODO: Implement export
    alert('Export feature coming soon!');
  };

  const handleMatchJobs = () => {
    navigate('/jobs');
  };

  // Get flattened skills for globe - using result.extracted_skills structure
  const flattenedSkills = result ? [
    ...(result.extracted_skills?.technical?.map((name: string) => ({ name, level: 85, category: 'Technical' })) || []),
    ...(result.extracted_skills?.soft?.map((name: string) => ({ name, level: 75, category: 'Soft Skills' })) || []),
    ...(result.extracted_skills?.business?.map((name: string) => ({ name, level: 70, category: 'Business' })) || []),
    ...(result.extracted_skills?.languages?.map((name: string) => ({ name, level: 80, category: 'Languages' })) || []),
    ...(result.extracted_skills?.tools?.map((name: string) => ({ name, level: 85, category: 'Tools' })) || []),
  ] : [];

  // Helper to get score value safely
  const getScore = (value: number | undefined, fallback: number = 0) => value ?? fallback;

  return (
    <div className="min-h-screen bg-slate-900 pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-4">
            AI CV Analyzer
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Upload your resume and get instant feedback on strengths, improvements, and skill analysis.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!result && !isAnalyzing && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              {/* Upload Zone */}
              <div
                {...getRootProps()}
                data-testid="dropzone"
                className={`
                  relative bg-slate-800 border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer
                  transition-all duration-200
                  ${isDragActive
                    ? 'border-primary bg-primary/10 scale-[1.01]'
                    : 'border-slate-600 hover:border-primary hover:bg-slate-700'
                  }
                `}
              >
                <input {...getInputProps()} data-testid="file-input" />

                {file ? (
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                      <FileText className="w-8 h-8 text-primary" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-semibold text-slate-100 mb-1">{file.name}</p>
                      <p className="text-sm text-slate-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleReset(); }}
                      className="p-2 rounded-lg bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-red-400 transition-colors"
                      aria-label="Remove file"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-24 h-24 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-6">
                      <Upload className="w-12 h-12 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-100 mb-2">
                      {isDragActive ? 'Drop your CV here' : 'Upload your CV'}
                    </h3>
                    <p className="text-slate-400 mb-6">
                      Supports PDF, DOCX, and TXT files. Your data is processed securely.
                    </p>
                    <div className="flex justify-center gap-6 text-sm text-slate-400">
                      <span className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        PDF
                      </span>
                      <span className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        DOCX
                      </span>
                      <span className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        TXT
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-center"
                  role="alert"
                >
                  {error}
                </motion.div>
              )}

              {/* Analyze Button */}
              <motion.button
                onClick={handleAnalyze}
                disabled={!file || isAnalyzing}
                whileTap={{ scale: 0.98 }}
                className={`
                  w-full mt-8 py-4 px-6 rounded-xl font-semibold text-lg
                  flex items-center justify-center gap-3
                  transition-colors duration-200
                  ${!file
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-primary/90 shadow-sm hover:shadow'
                  }
                `}
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <BarChart3 className="w-5 h-5" />
                    Analyze CV
                  </>
                )}
              </motion.button>
            </motion.div>
          )}

          {isAnalyzing && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-slate-800 rounded-2xl p-12 shadow-sm border border-slate-700 text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  className="w-32 h-32 mx-auto mb-6 relative"
                >
                  <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                  <div className="absolute inset-2 rounded-full border-4 border-primary/30 animate-pulse" />
                  <div className="absolute inset-4 rounded-full border-4 border-transparent border-t-primary animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-primary font-mono text-xl font-bold">
                      {Math.floor(Math.random() * 30 + 70)}%
                    </span>
                  </div>
                </motion.div>

                <h2 className="text-2xl font-bold text-slate-100 mb-2">
                  Processing your CV
                </h2>
                <p className="text-slate-400">
                  Extracting skills, parsing experience, calculating scores...
                </p>

                <div className="mt-8 space-y-3 max-w-sm mx-auto text-left">
                  {['Parsing document', 'Extracting skills', 'Calculating scores', 'Generating report'].map((step, i) => (
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.5 }}
                      className="flex items-center gap-3 text-slate-400"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span className="text-sm">{step}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {result && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {/* Score Section */}
              <section className="grid md:grid-cols-2 gap-8">
                <div className="bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-700">
                  <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-3">
                    <Award className="w-6 h-6 text-primary" />
                    CV Score Overview
                  </h2>

                  {/* Overall Score */}
                  <div className="mb-8">
                    <div className="flex justify-between items-end mb-3">
                      <span className="text-slate-400 font-medium">Overall Score</span>
                      <span className="text-5xl font-bold text-primary">
                        {getScore(result.overall_score)}%
                      </span>
                    </div>
                    <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${getScore(result.overall_score)}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full bg-primary rounded-full"
                      />
                    </div>
                  </div>

                  {/* Score Cards Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-slate-400">ATS Score</span>
                      </div>
                      <div className="text-2xl font-bold text-green-400">
                        {getScore(result.ats_score)}%
                      </div>
                    </div>
                    <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-primary" />
                        <span className="text-sm text-slate-400">Readability</span>
                      </div>
                      <div className="text-2xl font-bold text-primary">
                        {getScore(result.readability_score)}%
                      </div>
                    </div>
                    <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="w-4 h-4 text-secondary" />
                        <span className="text-sm text-slate-400">Impact</span>
                      </div>
                      <div className="text-2xl font-bold text-secondary">
                        {getScore(result.impact_score)}%
                      </div>
                    </div>
                    <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-orange-500" />
                        <span className="text-sm text-slate-400">Completeness</span>
                      </div>
                      <div className="text-2xl font-bold text-orange-500">
                        {getScore(result.completeness_score)}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2D Skill Visualization */}
                <div className="bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-700">
                  <h3 className="text-lg font-bold text-slate-100 mb-4">
                    Skill Distribution
                  </h3>
                  <div className="h-[300px] flex items-center justify-center">
                    {flattenedSkills.length > 0 ? (
                      <SkillGlobe
                        skills={flattenedSkills}
                        size={3}
                        onSkillClick={(name, level) => {
                          const category = Object.entries(result.extracted_skills).find(([, skills]: [string, string[]]) =>
                            skills.includes(name)
                          )?.[0] || 'Other';
                          setSelectedSkill({ name, level, category });
                        }}
                      />
                    ) : (
                      <p className="text-slate-500">No skills detected</p>
                    )}
                  </div>

                  {selectedSkill && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 bg-primary/5 rounded-xl border border-primary/20"
                    >
                      <h4 className="font-semibold text-primary">{selectedSkill.name}</h4>
                      <p className="text-sm text-slate-600">
                        Level: {selectedSkill.level}% • {selectedSkill.category}
                      </p>
                    </motion.div>
                  )}
                </div>
              </section>

              {/* Skills Breakdown */}
              <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(result.extracted_skills || {}).map(([category, skills]: [string, string[]]) => (
                  <div key={category} className="bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-700">
                    <h3 className="text-lg font-bold capitalize text-slate-100 mb-4">
                      {category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {skills && skills.length > 0 ? (
                        skills.map((skill: string) => (
                          <span
                            key={skill}
                            className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p className="text-slate-400 text-sm italic">No {category} skills detected</p>
                      )}
                    </div>
                  </div>
                ))}
              </section>

              {/* Extracted Info */}
              {(result.personal_info?.name || result.personal_info?.email || result.personal_info?.linkedin) && (
                <section className="bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-700">
                  <h3 className="text-xl font-bold text-slate-100 mb-6">Extracted Information</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {result.personal_info?.name && (
                      <div>
                        <p className="text-sm text-slate-400 mb-1">Name</p>
                        <p className="font-medium text-slate-100">{result.personal_info.name}</p>
                      </div>
                    )}
                    {result.personal_info?.email && (
                      <div>
                        <p className="text-sm text-slate-400 mb-1">Email</p>
                        <p className="font-medium text-slate-100">{result.personal_info.email}</p>
                      </div>
                    )}
                    {result.personal_info?.phone && (
                      <div>
                        <p className="text-sm text-slate-400 mb-1">Phone</p>
                        <p className="font-medium text-slate-100">{result.personal_info.phone}</p>
                      </div>
                    )}
                    {result.personal_info?.linkedin && (
                      <div>
                        <p className="text-sm text-slate-400 mb-1">LinkedIn</p>
                        <p className="font-medium text-primary">{result.personal_info.linkedin}</p>
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Recommendations */}
              <section className="bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-700">
                <h3 className="text-xl font-bold text-slate-100 mb-4">Recommendations</h3>
                {result.summary ? (
                  <p className="text-slate-300 leading-relaxed">{result.summary}</p>
                ) : (
                  <ul className="space-y-3 text-slate-300">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Add quantifiable achievements to demonstrate impact</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Include relevant keywords from job descriptions</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Structure experience in reverse-chronological order</span>
                    </li>
                  </ul>
                )}
              </section>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleMatchJobs}
                  className="px-8 py-4 bg-primary text-white rounded-xl font-semibold flex items-center justify-center gap-3 hover:bg-primary/90 transition-colors shadow-sm"
                >
                  <Target className="w-5 h-5" />
                  Match with Jobs
                </button>
                <button
                  onClick={handleExport}
                  className="px-8 py-4 bg-white border border-slate-300 text-slate-700 rounded-xl font-semibold flex items-center justify-center gap-3 hover:bg-slate-50 transition-colors"
                >
                  <FileDown className="w-5 h-5" />
                  Export Report
                </button>
                <button
                  onClick={handleReset}
                  className="px-8 py-4 bg-slate-100 text-slate-700 rounded-xl font-semibold flex items-center justify-center gap-3 hover:bg-slate-200 transition-colors"
                >
                  <RefreshCw className="w-5 h-5" />
                  Analyze Another CV
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
