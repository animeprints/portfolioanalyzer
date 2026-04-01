import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { CVAnalysis } from '../store/useStore'

export async function generatePDFReport(analysis: CVAnalysis): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  let y = margin

  // Helper function to add text with word wrap
  const addText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 12, color: string = '#000000', bold: boolean = false) => {
    doc.setFontSize(fontSize)
    doc.setFont('helvetica', bold ? 'bold' : 'normal')
    doc.setTextColor(color)

    const lines = doc.splitTextToSize(text, maxWidth)
    doc.text(lines, x, y)

    return lines.length * (fontSize * 0.3528) // Convert pt to mm
  }

  // Add header
  doc.setFillColor(6, 182, 212) // Cyan
  doc.rect(0, 0, pageWidth, 40, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('CV Analysis Report', pageWidth / 2, 25, { align: 'center' })

  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 35, { align: 'center' })

  y = 50

  // Add CV file name
  doc.setTextColor(0, 0, 0)
  addText(`CV Analyzed: ${analysis.fileName}`, margin, y, pageWidth - 2 * margin, 14, '#0284c7', true)
  y += 10

  // Overall Score
  doc.setFillColor(139, 92, 246) // Purple
  doc.circle(pageWidth - margin - 30, y + 15, 20, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text(`${analysis.scores.overall}`, pageWidth - margin - 30, y + 20, { align: 'center' })
  doc.setFontSize(10)
  doc.text('Overall', pageWidth - margin - 30, y + 30, { align: 'center' })

  y += 50

  // Section: Personal Info
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('Personal Information', margin, y, { align: 'left' })
  y += 8

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  if (analysis.personalInfo.name) {
    doc.text(`Name: ${analysis.personalInfo.name}`, margin + 5, y)
    y += 6
  }
  if (analysis.personalInfo.email) {
    doc.text(`Email: ${analysis.personalInfo.email}`, margin + 5, y)
    y += 6
  }
  if (analysis.personalInfo.phone) {
    doc.text(`Phone: ${analysis.personalInfo.phone}`, margin + 5, y)
    y += 6
  }
  if (analysis.personalInfo.linkedin) {
    doc.text(`LinkedIn: ${analysis.personalInfo.linkedin}`, margin + 5, y)
    y += 6
  }
  if (analysis.personalInfo.github) {
    doc.text(`GitHub: ${analysis.personalInfo.github}`, margin + 5, y)
    y += 6
  }
  y += 5

  // Section: Skills
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('Skills Identified', margin, y, { align: 'left' })
  y += 8

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  const skills = analysis.skills.slice(0, 15)
  const skillColumns = 2
  const columnWidth = (pageWidth - 2 * margin - 10) / skillColumns
  let col = 0
  let colY = y

  skills.forEach((skill, index) => {
    if (index % skillColumns === 0 && index > 0) {
      col++
      colY = y
    }
    const x = margin + col * columnWidth + 5
    const skillText = `${skill.name} (${Math.round(skill.relevance * 100)}%)`
    doc.text(skillText, x, colY)
    colY += 5
  })

  y = colY + 10

  // Section: Scores Breakdown
  if (y + 40 > doc.internal.pageSize.getHeight() - margin) {
    doc.addPage()
    y = margin
  }

  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('Score Breakdown', margin, y)
  y += 10

  const scoreMetrics = [
    { label: 'ATS Compatibility', value: analysis.scores.ats },
    { label: 'Readability', value: analysis.scores.readability },
    { label: 'Impact', value: analysis.scores.impact },
    { label: 'Completeness', value: analysis.scores.completeness }
  ]

  scoreMetrics.forEach(metric => {
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.text(metric.label, margin + 5, y)
    y += 5

    // Progress bar
    const barWidth = pageWidth - 2 * margin - 30
    const barHeight = 6
    const fillWidth = (metric.value / 100) * barWidth

    doc.setFillColor(230, 230, 230)
    doc.rect(margin + 5, y - 4, barWidth, barHeight, 'F')

    const color: [number, number, number] = metric.value >= 80 ? [16, 185, 129] : metric.value >= 60 ? [245, 158, 11] : [239, 68, 68]
    doc.setFillColor(...color)
    doc.rect(margin + 5, y - 4, fillWidth, barHeight, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(9)
    doc.text(`${metric.value}%`, margin + 5 + barWidth / 2, y - 1, { align: 'center' })

    doc.setTextColor(0, 0, 0)
    y += 8
  })

  // Section: Strengths
  y += 5
  if (y + 50 > doc.internal.pageSize.getHeight() - margin) {
    doc.addPage()
    y = margin
  }

  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('Key Strengths', margin, y)
  y += 10

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  analysis.feedback.strengths.forEach((strength) => {
    if (y > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage()
      y = margin
    }
    doc.setTextColor(16, 185, 129)
    doc.text('✓', margin + 5, y)
    doc.setTextColor(0, 0, 0)
    doc.text(strength, margin + 12, y)
    y += 6
  })

  // Section: Recommendations
  y += 5
  if (y + 60 > doc.internal.pageSize.getHeight() - margin) {
    doc.addPage()
    y = margin
  }

  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('Recommendations', margin, y)
  y += 10

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  analysis.feedback.improvements.forEach((improvement) => {
    if (y > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage()
      y = margin
    }
    doc.setTextColor(239, 68, 68)
    doc.text('→', margin + 5, y)
    doc.setTextColor(0, 0, 0)
    doc.text(improvement, margin + 12, y)
    y += 6
  })

  // Section: Missing Skills
  if (analysis.feedback.missingSkills.length > 0) {
    y += 5
    if (y + 30 > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage()
      y = margin
    }

    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('Skills to Consider Adding', margin, y)
    y += 10

    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    analysis.feedback.missingSkills.slice(0, 10).forEach((skill) => {
      if (y > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage()
        y = margin
      }
      doc.setTextColor(139, 92, 246)
      doc.text('•', margin + 5, y)
      doc.setTextColor(0, 0, 0)
      doc.text(skill, margin + 12, y)
      y += 6
    })
  }

  // Footer
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(9)
    doc.setTextColor(150, 150, 150)
    doc.text(
      `Page ${i} of ${pageCount} • CV Analyzer 3D`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    )
  }

  doc.save(`cv-analysis-${Date.now()}.pdf`)
}

export async function captureVisualization(element: HTMLElement): Promise<string> {
  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: '#0a0a0a',
    logging: false
  })

  return canvas.toDataURL('image/png')
}
