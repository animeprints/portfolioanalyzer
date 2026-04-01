import { CVAnalysis, Skill } from '../store/useStore'
import {
  extractEmail,
  extractPhone,
  extractLinkedIn,
  extractGitHub,
  extractWebsite
} from './cvParser'

// Comprehensive skill database
const SKILL_DATABASE = {
  technical: [
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'go', 'rust', 'swift',
    'react', 'vue', 'angular', 'node.js', 'express', 'django', 'flask', 'spring', 'laravel',
    'html', 'css', 'sass', 'tailwind', 'bootstrap', 'material-ui', 'webpack', 'vite',
    'git', 'github', 'gitlab', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'terraform',
    'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch', 'neo4j', 'sqlite',
    'rest', 'graphql', 'grpc', 'soap', 'api', 'microservices', 'serverless',
    'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'scikit-learn', 'nlp',
    'data analysis', 'data science', 'big data', 'hadoop', 'spark', 'kafka',
    'ios', 'android', 'flutter', 'react native', 'xamarin', 'kotlin', 'objective-c',
    'linux', 'unix', 'bash', 'powershell', 'ci/cd', 'jenkins', 'circleci', 'travis',
    'agile', 'scrum', 'kanban', 'jira', 'confluence', 'notion',
    'figma', 'sketch', 'adobe xd', 'photoshop', 'illustrator', 'ui/ux',
    'testing', 'jest', 'mocha', 'chai', 'pytest', 'selenium', 'cypress', 'postman',
    'websocket', 'socket.io', 'webrtc', 'oauth', 'jwt', 'saml', 'sso'
  ],
  soft: [
    'communication', 'teamwork', 'leadership', 'problem-solving', 'critical thinking',
    'time management', 'adaptability', 'creativity', 'collaboration', 'conflict resolution',
    'emotional intelligence', 'negotiation', 'presentation', 'public speaking',
    'mentoring', 'coaching', 'decision making', 'strategic thinking', 'emotional-intelligence',
    'self-motivation', 'work ethic', 'attention to detail', 'organization', 'planning'
  ],
  business: [
    'project management', 'product management', 'business analysis', 'requirement gathering',
    'stakeholder management', 'budgeting', 'forecasting', 'strategy', 'marketing',
    'seo', 'sem', 'content marketing', 'social media', 'analytics', 'google analytics',
    'sales', 'customer success', 'account management', 'contract negotiation',
    'operations', 'logistics', 'supply chain', 'procurement', 'quality assurance',
    'risk management', 'compliance', 'audit', 'change management'
  ],
  languages: [
    'english', 'spanish', 'french', 'german', 'chinese', 'japanese', 'korean',
    'arabic', 'russian', 'portuguese', 'italian', 'hindi', 'bengali', 'dutch',
    'tamil', 'telugu', 'marathi', 'gujarati', 'urdu', 'indonesian', 'malay'
  ],
  tools: [
    'vs code', 'visual studio', 'intellij', 'pycharm', 'eclipse', 'netbeans',
    'jira', 'confluence', 'notion', 'asana', 'trello', 'monday', 'slack', 'teams',
    'figma', 'sketch', 'adobe xd', 'photoshop', 'illustrator', 'after effects',
    'excel', 'powerpoint', 'word', 'google sheets', 'looker studio', 'tableau', 'power bi',
    'terminal', 'command line', 'putty', 'winscp', 'filezilla', 'postman', 'insomnia'
  ]
}

// Action verbs for impact assessment
const ACTION_VERBS = [
  'achieved', 'improved', 'increased', 'decreased', 'reduced', 'optimized',
  'developed', 'implemented', 'created', 'designed', 'led', 'managed',
  'launched', 'delivered', 'completed', 'saved', 'generated', 'expanded',
  'accelerated', 'streamlined', 'automated', 'enhanced', 'revamped',
  'pioneered', 'spearheaded', 'orchestrated', 'architected', 'engineered'
]

// Degree keywords for education detection
const DEGREE_KEYWORDS = [
  'bachelor', 'master', 'phd', 'doctorate', 'b.s.', 'm.s.', 'b.a.', 'm.a.',
  'bs', 'ms', 'ba', 'ma', 'associate', 'diploma', 'certificate'
]

export function analyzeCV(text: string): CVAnalysis {
  const lowerText = text.toLowerCase()
  const lines = text.split('\n').filter(line => line.trim())

  // Extract personal info
  const personalInfo = {
    name: extractName(lines),
    email: extractEmail(text) || undefined,
    phone: extractPhone(text) || undefined,
    linkedin: extractLinkedIn(text) || undefined,
    github: extractGitHub(text) || undefined,
    website: extractWebsite(text) || undefined
  }

  // Extract skills
  const skills = extractSkills(lowerText)

  // Analyze experience
  const experience = analyzeExperience(text)

  // Extract education
  const education = extractEducation(text)

  // Calculate scores
  const scores = calculateScores(text, lowerText, skills, experience)

  // Generate feedback
  const feedback = generateFeedback(text, lowerText, skills, experience, scores)

  // Extract summary
  const summary = extractSummary(text)

  return {
    id: generateId(),
    fileName: 'cv.pdf',
    uploadDate: new Date(),
    personalInfo,
    summary,
    skills,
    experience,
    education,
    scores,
    feedback,
    rawText: text
  }
}

function extractName(lines: string[]): string | undefined {
  // Name is usually at the top, before first email/phone
  for (const line of lines.slice(0, 5)) {
    const trimmed = line.trim()
    if (trimmed && !trimmed.includes('@') && !trimmed.match(/^\d+/) && trimmed.length > 2 && trimmed.length < 40) {
      // Check if it's not a section header
      if (!trimmed.match(/^(summary|experience|education|skills|projects|certifications|contact)$/i)) {
        return trimmed
      }
    }
  }
  return undefined
}

function extractSummary(text: string): string | undefined {
  // Look for summary/objective section
  const summaryPatterns = [
    /summary[:\s]*\n([\s\S]*?)(?=\n\n|\n[A-Z][a-z]+[:\s]*\n)/i,
    /profile[:\s]*\n([\s\S]*?)(?=\n\n|\n[A-Z][a-z]+[:\s]*\n)/i,
    /objective[:\s]*\n([\s\S]*?)(?=\n\n|\n[A-Z][a-z]+[:\s]*\n)/i,
    /about[:\s]*\n([\s\S]*?)(?=\n\n|\n[A-Z][a-z]+[:\s]*\n)/i
  ]

  for (const pattern of summaryPatterns) {
    const match = text.match(pattern)
    if (match) {
      return match[1].trim().slice(0, 500)
    }
  }

  // Fallback: first few sentences
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20)
  return sentences.slice(0, 2).join('. ').trim() + '.'
}

function extractSkills(lowerText: string): Skill[] {
  const foundSkills: Skill[] = []
  const words = lowerText.split(/\s+/)

  for (const [category, skillList] of Object.entries(SKILL_DATABASE)) {
    for (const skill of skillList) {
      if (lowerText.includes(skill)) {
        // Calculate score based on frequency and context
        const frequency = words.filter(word => word === skill).length
        const relevance = calculateSkillRelevance(skill, lowerText)
        const score = Math.min(100, 50 + frequency * 10 + relevance * 30)

        foundSkills.push({
          name: skill,
          category: category as Skill['category'],
          score,
          relevance
        })
      }
    }
  }

  // Remove duplicates and sort by relevance
  return foundSkills
    .filter((skill, index, self) =>
      index === self.findIndex(s => s.name === skill.name)
    )
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 30) // Top 30 skills
}

function calculateSkillRelevance(skill: string, text: string): number {
  // Higher relevance if skill appears near experience/achievement sections
  const contextBoost = /project|experience|work|achievement|developed|built|created|managed/i.test(text) ? 1.2 : 1
  const frequency = (text.match(new RegExp(skill, 'gi')) || []).length
  return Math.min(1, frequency * 0.1) * contextBoost
}

function analyzeExperience(text: string): CVAnalysis['experience'] {
  // Detect years of experience
  const yearPatterns = [
    /(\d+)\+?\s+years?\s+experience/i,
    /experience.*?(\d+)\+?\s+years?/i,
    /(\d{4})\s*[-–]\s*(?:present|current|\d{4})/gi
  ]

  let years = 0
  for (const pattern of yearPatterns) {
    const matches = text.match(pattern)
    if (matches) {
      const numMatch = matches[0].match(/\d+/)
      if (numMatch) {
        const num = parseInt(numMatch[0])
        if (num < 50) years = Math.max(years, num)
      }
    }
  }

  // If no explicit years, estimate from work history
  if (years === 0) {
    const dateMatches = text.match(/(20\d{2}|19\d{2})\s*[-–]\s*(present|current|20\d{2})/gi)
    years = dateMatches ? Math.min(dateMatches.length * 2, 20) : 1
  }

  // Determine level
  let level: CVAnalysis['experience']['level'] = 'junior'
  if (years >= 10) level = 'lead'
  else if (years >= 7) level = 'senior'
  else if (years >= 3) level = 'mid'

  // Extract positions (simplified)
  const positions = extractPositions(text)

  return {
    years,
    level,
    positions
  }
}

function extractPositions(text: string): CVAnalysis['experience']['positions'] {
  const positions: CVAnalysis['experience']['positions'] = []
  const lines = text.split('\n')

  // Look for job title patterns
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    // Job title often followed by company name
    if (line && line.length < 60 && line.length > 5 &&
        !line.match(/^(summary|education|skills|projects|certifications|contact)$/i) &&
        !line.match(/^[a-zA-Z\s]+ University|College|Institute/i) &&
        !line.includes('@') && !line.match(/^\d+/) &&
        (line.match(/^(Senior|Junior|Lead|Principal|Staff|Chief|Director|Manager)\s+[A-Z]/i) ||
         line.match(/(Engineer|Developer|Designer|Analyst|Consultant|Architect|Specialist)$/i) ||
         line.match(/^[A-Z][a-z]+ [A-Z][a-z]+$/))) {
      positions.push({
        title: line,
        company: i + 1 < lines.length ? lines[i + 1].trim() : 'Unknown',
        duration: '',
        description: []
      })
    }
  }

  return positions.slice(0, 5)
}

function extractEducation(text: string): CVAnalysis['education'] {
  const education: CVAnalysis['education'] = []
  const educationSection = findSection(text, 'education')

  if (educationSection) {
    const linesInSection = educationSection.split('\n')
    for (const line of linesInSection) {
      const trimmed = line.trim()
      if (trimmed.length > 10 && trimmed.length < 100) {
        const degree = DEGREE_KEYWORDS.find(keyword => trimmed.toLowerCase().includes(keyword))
        if (degree) {
          education.push({
            degree: trimmed,
            institution: '',
            year: ''
          })
        }
      }
    }
  }

  return education.slice(0, 3)
}

function findSection(text: string, sectionName: string): string | null {
  const pattern = new RegExp(`${sectionName}[:\s]*\n([\s\S]*?)(?=\n\n|\n[A-Z][a-z]+[:\s]*\n|$)`, 'i')
  const match = text.match(pattern)
  return match ? match[1].trim() : null
}

function calculateScores(
  text: string,
  lowerText: string,
  skills: Skill[],
  experience: CVAnalysis['experience']
): CVAnalysis['scores'] {
  // Overall score (weighted average)
  const ats = calculateATSScore(lowerText, skills)
  const readability = calculateReadabilityScore(text)
  const impact = calculateImpactScore(text)
  const completeness = calculateCompletenessScore(text, skills, experience)

  const overall = Math.round(
    ats * 0.35 +
    readability * 0.2 +
    impact * 0.25 +
    completeness * 0.2
  )

  return { overall, ats, readability, impact, completeness }
}

function calculateATSScore(text: string, skills: Skill[]): number {
  // ATS score based on keyword density, format, and skills match
  let score = 50 // base

  // Skills presence
  if (skills.length >= 10) score += 20
  else if (skills.length >= 5) score += 10

  // Contact info
  if (text.includes('@') && /\+?\d/.test(text)) score += 10

  // Format check - presence of sections
  const sections = ['experience', 'education', 'skills']
  sections.forEach(section => {
    if (text.toLowerCase().includes(section)) score += 5
  })

  // Penalty for very long lines (ATS often truncate)
  const longLines = text.split('\n').filter(line => line.length > 120)
  if (longLines.length > 10) score -= 10

  return Math.min(100, Math.max(0, score))
}

function calculateReadabilityScore(text: string): number {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
  const words = text.split(/\s+/).filter(w => w.length > 0)
  const avgSentenceLength = words.length / Math.max(1, sentences.length)

  // Ideal: 15-20 words per sentence
  if (avgSentenceLength >= 10 && avgSentenceLength <= 25) return 85
  if (avgSentenceLength < 10 || avgSentenceLength > 30) return 60

  return 70
}

function calculateImpactScore(text: string): number {
  let score = 50

  // Count action verbs
  const lowerText = text.toLowerCase()
  ACTION_VERBS.forEach(verb => {
    if (lowerText.includes(verb)) score += 2
  })

  // Check for quantifiable achievements (numbers with % or $)
  const metrics = text.match(/(\d+%|\$\d+|\d+\s*(million|billion|k|percent|%))/gi)
  if (metrics) score += Math.min(metrics.length * 3, 20)

  return Math.min(100, score)
}

function calculateCompletenessScore(
  text: string,
  skills: Skill[],
  experience: CVAnalysis['experience']
): number {
  let score = 0

  // Check essential sections
  const required = ['experience', 'education', 'contact', 'skills']
  const lowerText = text.toLowerCase()
  required.forEach(section => {
    if (lowerText.includes(section)) score += 15
  })

  // Skills diversity
  if (skills.length >= 15) score += 20
  else if (skills.length >= 8) score += 10

  // Experience depth
  if (experience.positions.length >= 3) score += 15
  else if (experience.positions.length >= 1) score += 5

  return Math.min(100, score)
}

function generateFeedback(
  text: string,
  lowerText: string,
  skills: Skill[],
  experience: CVAnalysis['experience'],
  scores: CVAnalysis['scores']
): CVAnalysis['feedback'] {
  const strengths: string[] = []
  const improvements: string[] = []
  let keywords: string[] = []
  const missingSkills: string[] = []

  // Strengths
  if (scores.overall >= 80) {
    strengths.push('Excellent CV structure and content')
  }
  if (skills.length >= 15) {
    strengths.push(`Strong skill set with ${skills.length} identified skills`)
  }
  if (scores.impact >= 75) {
    strengths.push('Good use of action verbs and quantifiable achievements')
  }
  if (experience.years >= 5) {
    strengths.push(`Substantial experience (${experience.years} years)` )
  }
  if (text.includes('@') && /\+?\d/.test(text)) {
    strengths.push('Complete contact information')
  }

  // Improvements
  if (scores.ats < 70) {
    improvements.push('Optimize for ATS: use standard section headers, avoid complex formatting')
  }
  if (skills.length < 10) {
    improvements.push('Add more relevant technical and soft skills')
  }
  if (scores.readability < 70) {
    improvements.push('Improve readability: use shorter sentences, bullet points')
  }
  if (!text.match(/\d+%|\$\d+|\d+\s*(million|billion|k|percent|%)/i)) {
    improvements.push('Include quantifiable achievements with metrics and percentages')
  }
  if (lowerText.includes('reference available') || lowerText.includes('references upon request')) {
    improvements.push('Remove "References available" - use that space for valuable content')
  }

  // Missing common high-value skills (suggested)
  const allSkills = skills.map(s => s.name)
  const technicalSkills = SKILL_DATABASE.technical.filter(s => !allSkills.includes(s))
  if (technicalSkills.length > 0 && experience.level !== 'junior') {
    missingSkills.push(...technicalSkills.slice(0, 5))
  }

  // Extract keywords from text (most frequent meaningful words)
  const wordFreq = new Map<string, number>()
  const stopWords = new Set(['the', 'and', 'or', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'as', 'is', 'was', 'are', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'this', 'that', 'these', 'those', 'my', 'your', 'his', 'her', 'its', 'our', 'their', 'a', 'an', 'the'])
  text.split(/\s+/).forEach(word => {
    const clean = word.toLowerCase().replace(/[^a-z0-9]/g, '')
    if (clean.length > 3 && !stopWords.has(clean)) {
      wordFreq.set(clean, (wordFreq.get(clean) || 0) + 1)
    }
  })

  keywords = Array.from(wordFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word)

  return { strengths, improvements, keywords, missingSkills }
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
