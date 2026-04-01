import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { JobDescription } from '../store/useStore'

interface JobMatchCardProps {
  job: JobDescription
}

export default function JobMatchCard({ job }: JobMatchCardProps) {
  const [expanded, setExpanded] = useState(false)

  const getMatchColor = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getMatchLabel = (score: number) => {
    if (score >= 80) return 'Excellent Match'
    if (score >= 60) return 'Good Match'
    if (score >= 40) return 'Fair Match'
    return 'Poor Match'
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-6 flex flex-col gap-4"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-1">{job.title}</h3>
          {job.company && (
            <p className="text-gray-400 text-sm">{job.company}</p>
          )}
        </div>

        {/* Match score circle */}
        <div className="relative">
          <svg className="w-16 h-16 transform -rotate-90">
            <circle
              cx="16"
              cy="16"
              r="14"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="2.5"
            />
            <circle
              cx="16"
              cy="16"
              r="14"
              fill="none"
              stroke={getMatchColor(job.matchScore || 0)}
              strokeWidth="2.5"
              strokeDasharray={`${2 * Math.PI * 14}`}
              strokeDashoffset={`${2 * Math.PI * 14 * (1 - (job.matchScore || 0) / 100)}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-white">
              {job.matchScore || 0}%
            </span>
          </div>
        </div>
      </div>

      <div className={`px-3 py-1 rounded-full text-xs font-medium ${getMatchColor(job.matchScore || 0)} bg-opacity-20 text-white inline-block w-max`}>
        {getMatchLabel(job.matchScore || 0)}
      </div>

      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="space-y-4 pt-2"
        >
          {/* Matched Skills */}
          {job.matchedSkills && job.matchedSkills.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-green-400 mb-2">Matched Skills</h4>
              <div className="flex flex-wrap gap-2">
                {job.matchedSkills.slice(0, 5).map(skill => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-full text-xs bg-green-500/20 text-green-300 border border-green-500/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Missing Skills */}
          {job.missingSkills && job.missingSkills.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-yellow-400 mb-2">Skills to Add</h4>
              <div className="flex flex-wrap gap-2">
                {job.missingSkills.slice(0, 5).map(skill => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-2">Requirements</h4>
              <ul className="space-y-1">
                {job.requirements.slice(0, 4).map((req, i) => (
                  <li key={i} className="text-gray-400 text-xs flex items-start gap-2">
                    <span className="text-cyan-400 mt-0.5">•</span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}

      <div className="flex gap-2 mt-auto pt-2 border-t border-white/10">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex-1 flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-4 h-4" /> Less
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" /> Details
            </>
          )}
        </button>
        <button className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}
