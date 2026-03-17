import fs from 'fs'
import pdf from 'pdf-parse'

export const extractSchemesFromPDF = async (filePath) => {
  const buffer = fs.readFileSync(filePath)
  const data = await pdf(buffer)

  const text = data.text

  const schemes = []

  const chunks = text.split('\n\n')

  chunks.forEach((chunk) => {
    if (chunk.toLowerCase().includes('scheme') || chunk.toLowerCase().includes('yojana')) {
      schemes.push({
        name: chunk.slice(0, 80),
        description: chunk,
        category: 'General',
        state: 'Central',
        ministry: 'Government of India',
        benefit: 'Refer Gazette',
        eligibility: ['Refer Gazette'],
        isActive: true,
      })
    }
  })

  return schemes
}