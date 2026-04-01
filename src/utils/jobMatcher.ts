import { JobDescription, Skill } from '../store/useStore'

export interface MatchResult {
  matchScore: number
  matchedSkills: string[]
  missingSkills: string[]
  suggestions: string[]
  atsKeywords: string[]
  compatibility: 'excellent' | 'good' | 'fair' | 'poor'
}

export function matchJobDescription(
  cvSkills: Skill[],
  jobDescription: JobDescription
): MatchResult {
  const jobText = `${jobDescription.title} ${jobDescription.description} ${jobDescription.requirements.join(' ')}`.toLowerCase()

  // Extract skills from job description
  const jobSkillKeywords = extractSkillsFromText(jobText)

  // Match CV skills against job requirements
  const cvSkillNames = cvSkills.map(s => s.name.toLowerCase())

  const matchedSkills: string[] = []
  const missingSkills: string[] = []

  for (const jobSkill of jobSkillKeywords) {
    const exactMatch = cvSkillNames.find(cvSkill =>
      cvSkill === jobSkill || cvSkill.includes(jobSkill) || jobSkill.includes(cvSkill)
    )

    if (exactMatch) {
      matchedSkills.push(jobSkill)
    } else {
      missingSkills.push(jobSkill)
    }
  }

  // Calculate match score
  const totalRequired = jobSkillKeywords.length
  const matchedCount = matchedSkills.length
  const baseScore = totalRequired > 0 ? (matchedCount / totalRequired) * 100 : 0

  // Adjust score based on experience level alignment and keyword density
  const experienceBonus = calculateExperienceBonus(cvSkills, jobDescription)
  const keywordDensity = calculateKeywordDensity(jobText, cvSkillNames)

  const finalScore = Math.min(100, Math.round(
    baseScore * 0.7 +
    experienceBonus * 0.2 +
    keywordDensity * 0.1
  ))

  // Determine compatibility level
  let compatibility: MatchResult['compatibility'] = 'poor'
  if (finalScore >= 80) compatibility = 'excellent'
  else if (finalScore >= 60) compatibility = 'good'
  else if (finalScore >= 40) compatibility = 'fair'

  // Generate suggestions
  const suggestions = generateSuggestions(matchedSkills, missingSkills, finalScore)

  // Extract ATS keywords from job description
  const atsKeywords = extractATSKeywords(jobText)

  return {
    matchScore: finalScore,
    matchedSkills,
    missingSkills,
    suggestions,
    atsKeywords,
    compatibility
  }
}

function extractSkillsFromText(text: string): string[] {
  // Common tech and business skills to look for
  const skillPatterns = [
    // Programming languages
    /\b(javascript|typescript|python|java|c\+\+|c#|ruby|go|rust|swift|kotlin|php|scala|r|matlab)\b/gi,
    // Frameworks & libraries
    /\b(react|vue|angular|node\.js|express|django|flask|spring|laravel|rails|next\.js|nuxt\.js|svelte)\b/gi,
    // Databases
    /\b(mongodb|postgresql|mysql|redis|elasticsearch|neo4j|cassandra|sqlite|oracle|sql server)\b/gi,
    // Cloud & DevOps
    /\b(aws|azure|gcp|docker|kubernetes|terraform|jenkins|circleci|gitlab|github actions)\b/gi,
    // Tools & methods
    /\b(git|agile|scrum|kanban|ci\/cd|devops|machine learning|deep learning|data science|analytics)\b/gi,
    // Soft skills & roles
    /\b(project management|product management|team leadership|communication|problem\.solving|leadership)\b/gi
  ]

  const foundSkills = new Set<string>()

  for (const pattern of skillPatterns) {
    const matches = text.match(pattern)
    if (matches) {
      matches.forEach(skill => foundSkills.add(skill.toLowerCase().replace(/\./g, '')))
    }
  }

  return Array.from(foundSkills)
}

function calculateExperienceBonus(cvSkills: Skill[], job: JobDescription): number {
  // Simplified: if CV has senior/lead level skills and job mentions senior titles
  const cvLevel = cvSkills.some(s => s.name.toLowerCase().includes('architect') || s.name.toLowerCase().includes('principal')) ? 0.9 :
                  cvSkills.some(s => s.name.toLowerCase().includes('senior')) ? 0.8 :
                  cvSkills.some(s => s.name.toLowerCase().includes('lead')) ? 0.85 : 0.6

  const jobLevel = job.title.toLowerCase().includes('senior') || job.title.toLowerCase().includes('lead') ? 0.9 :
                   job.title.toLowerCase().includes('junior') || job.title.toLowerCase().includes('intern') ? 0.4 : 0.7

  // Bonus if levels align (within 0.2)
  const alignment = Math.abs(cvLevel - jobLevel) < 0.2 ? 0.2 : 0

  return Math.min(1, 0.5 + alignment)
}

function calculateKeywordDensity(jobText: string, cvSkills: string[]): number {
  let keywordHits = 0
  const words = jobText.split(/\s+/).length

  for (const skill of cvSkills) {
    const regex = new RegExp(skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
    const matches = jobText.match(regex)
    if (matches) {
      keywordHits += matches.length
    }
  }

  // Normalize: optimal density ~2-5%
  const density = words > 0 ? keywordHits / words : 0
  return density >= 0.02 && density <= 0.05 ? 1 : 0.5
}

function generateSuggestions(
  matchedSkills: string[],
  missingSkills: string[],
  score: number
): string[] {
  const suggestions: string[] = []

  if (score >= 80) {
    suggestions.push('Excellent match! Highlight these matching skills prominently in your interview.')
  } else if (score >= 60) {
    suggestions.push('Good match! Focus on your shared skills during the interview.')
  } else if (score >= 40) {
    suggestions.push('Moderate match. Emphasize transferable skills and consider upskilling.')
  } else {
    suggestions.push('Low match. This role may require significant skill development.')
  }

  if (missingSkills.length > 0) {
    const topMissing = missingSkills.slice(0, 3)
    suggestions.push(`Consider learning: ${topMissing.join(', ')}`)
  }

  if (matchedSkills.length > 0) {
    suggestions.push(`Lead with these key skills: ${matchedSkills.slice(0, 3).join(', ')}`)
  }

  suggestions.push('Tailor your resume to include exact keywords from the job description')
  suggestions.push('Quantify achievements that demonstrate the required skills')

  return suggestions
}

function extractATSKeywords(text: string): string[] {
  // Extract important keywords (nouns, technical terms, repeated terms)
  const words = text.toLowerCase().split(/\s+/)
  const freq = new Map<string, number>()

  const stopWords = new Set(['the', 'and', 'or', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'as'])

  words.forEach(word => {
    const clean = word.replace(/[^\w]/g, '')
    if (clean.length > 3 && !stopWords.has(clean)) {
      freq.set(clean, (freq.get(clean) || 0) + 1)
    }
  })

  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([word]) => word)
}
