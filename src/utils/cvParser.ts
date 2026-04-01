import * as pdfjsLib from 'pdfjs-dist'
import mammoth from 'mammoth'

// Set worker source for pdf.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

export interface ParsedCV {
  text: string
  fileName: string
  fileType: 'pdf' | 'docx' | 'txt'
}

export async function parsePDF(file: File): Promise<ParsedCV> {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  let fullText = ''

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const textContent = await page.getTextContent()
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ')
    fullText += pageText + '\n'
  }

  return {
    text: fullText,
    fileName: file.name,
    fileType: 'pdf'
  }
}

export async function parseDOCX(file: File): Promise<ParsedCV> {
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer })

  return {
    text: result.value,
    fileName: file.name,
    fileType: 'docx'
  }
}

export async function parseTXT(file: File): Promise<ParsedCV> {
  const text = await file.text()

  return {
    text,
    fileName: file.name,
    fileType: 'txt'
  }
}

export async function parseFile(file: File): Promise<ParsedCV> {
  const fileType = file.type

  if (fileType === 'application/pdf' || file.name.endsWith('.pdf')) {
    return parsePDF(file)
  } else if (
    fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    file.name.endsWith('.docx')
  ) {
    return parseDOCX(file)
  } else if (fileType === 'text/plain' || file.name.endsWith('.txt')) {
    return parseTXT(file)
  } else {
    throw new Error('Unsupported file type. Please upload PDF, DOCX, or TXT files.')
  }
}

export function extractEmail(text: string): string | null {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
  const matches = text.match(emailRegex)
  return matches ? matches[0] : null
}

export function extractPhone(text: string): string | null {
  const phoneRegex = /(\+?1?[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/g
  const matches = text.match(phoneRegex)
  return matches ? matches[0] : null
}

export function extractLinkedIn(text: string): string | null {
  const linkedinRegex = /linkedin\.com\/in\/[a-zA-Z0-9_-]+/gi
  const matches = text.match(linkedinRegex)
  return matches ? matches[0] : null
}

export function extractGitHub(text: string): string | null {
  const githubRegex = /github\.com\/[a-zA-Z0-9_-]+/gi
  const matches = text.match(githubRegex)
  return matches ? matches[0] : null
}

export function extractWebsite(text: string): string | null {
  const websiteRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi
  const matches = text.match(websiteRegex)
  if (matches) {
    // Filter out LinkedIn and GitHub
    const filtered = matches.filter(url =>
      !url.includes('linkedin.com') && !url.includes('github.com')
    )
    return filtered[0] || null
  }
  return null
}
