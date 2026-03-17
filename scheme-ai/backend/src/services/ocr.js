import Tesseract from 'tesseract.js'
import { logger } from '../utils/logger.js'

// Indian ID document field patterns
const PATTERNS = {
  name: [
    /(?:name|नाम|பெயர்|పేరు)[:\s]*([A-Z][A-Za-z\s]+)/i,
    /^([A-Z][A-Z\s]{3,30})$/m,
  ],
  dob: [
    /(?:dob|date of birth|जन्म तिथि|பிறந்த தேதி)[:\s]*(\d{2}[\/\-]\d{2}[\/\-]\d{4})/i,
    /(\d{2}[\/\-]\d{2}[\/\-]\d{4})/,
  ],
  gender: [
    /\b(male|female|पुरुष|महिला|ஆண்|பெண்|స్త్రీ|పురుషుడు)\b/i,
  ],
  aadhaar: [
    /(\d{4}\s\d{4}\s\d{4})/,
    /(\d{12})/,
  ],
  pincode: [
    /\b(\d{6})\b/,
  ],
  address: [
    /(?:address|पता|முகவரி|చిరునామా)[:\s]*(.{20,100})/i,
  ],
  voter_id: [
    /([A-Z]{3}\d{7})/,
  ],
}

const cleanText = (text) => text.replace(/\s+/g, ' ').trim()

const extractField = (text, patterns) => {
  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match) return cleanText(match[1] || match[0])
  }
  return null
}

export const extractFromDocument = async (imagePath, docType = 'aadhaar') => {
  logger.info(`OCR processing: ${imagePath}`)

  try {
    // Multi-language OCR: English + Hindi + Tamil + Telugu
    const { data } = await Tesseract.recognize(imagePath, 'eng+hin+tam+tel', {
      logger: m => {
        if (m.status === 'recognizing text') {
          logger.debug(`OCR progress: ${Math.round(m.progress * 100)}%`)
        }
      },
    })

    const rawText = data.text
    logger.debug(`OCR raw text: ${rawText.substring(0, 200)}...`)

    // Extract structured fields
    const fields = {
      name: extractField(rawText, PATTERNS.name),
      dob: extractField(rawText, PATTERNS.dob),
      gender: extractField(rawText, PATTERNS.gender),
      aadhaar: extractField(rawText, PATTERNS.aadhaar),
      address: extractField(rawText, PATTERNS.address),
      pincode: extractField(rawText, PATTERNS.pincode),
    }

    // Detect state from pincode
    if (fields.pincode) {
      fields.state = detectStateFromPincode(fields.pincode)
    }

    // Clean null fields
    const cleaned = Object.fromEntries(
      Object.entries(fields).filter(([_, v]) => v !== null)
    )

    return {
      success: true,
      fields: cleaned,
      confidence: data.confidence,
      rawText: rawText.substring(0, 500),
    }
  } catch (err) {
    logger.error(`OCR error: ${err.message}`)
    throw new Error(`OCR processing failed: ${err.message}`)
  }
}

// Detect state from first 2-3 digits of pincode
const detectStateFromPincode = (pincode) => {
  const pin = parseInt(pincode.replace(/\s/g, ''))
  const prefix = Math.floor(pin / 10000)
  const map = {
    11: 'Delhi', 12: 'Haryana', 13: 'Haryana', 14: 'Punjab', 15: 'Punjab',
    16: 'Punjab', 17: 'Himachal Pradesh', 18: 'Jammu & Kashmir', 19: 'Jammu & Kashmir',
    20: 'Uttar Pradesh', 21: 'Uttar Pradesh', 22: 'Uttar Pradesh', 23: 'Uttar Pradesh',
    24: 'Uttar Pradesh', 25: 'Uttar Pradesh', 26: 'Uttar Pradesh', 27: 'Uttar Pradesh',
    28: 'Uttar Pradesh', 30: 'Rajasthan', 31: 'Rajasthan', 32: 'Rajasthan',
    33: 'Rajasthan', 34: 'Rajasthan', 36: 'Gujarat', 37: 'Gujarat', 38: 'Gujarat',
    39: 'Gujarat', 40: 'Maharashtra', 41: 'Maharashtra', 42: 'Maharashtra',
    43: 'Maharashtra', 44: 'Maharashtra', 45: 'Madhya Pradesh', 46: 'Madhya Pradesh',
    47: 'Madhya Pradesh', 48: 'Madhya Pradesh', 49: 'Chhattisgarh',
    50: 'Andhra Pradesh', 51: 'Andhra Pradesh', 52: 'Andhra Pradesh',
    53: 'Andhra Pradesh', 56: 'Karnataka', 57: 'Karnataka', 58: 'Karnataka',
    59: 'Karnataka', 60: 'Tamil Nadu', 61: 'Tamil Nadu', 62: 'Tamil Nadu',
    63: 'Tamil Nadu', 64: 'Tamil Nadu', 67: 'Kerala', 68: 'Kerala', 69: 'Kerala',
    70: 'West Bengal', 71: 'West Bengal', 72: 'West Bengal', 73: 'West Bengal',
    74: 'West Bengal', 75: 'Odisha', 76: 'Odisha', 77: 'Odisha',
    78: 'Assam', 79: 'Assam', 80: 'Bihar', 81: 'Bihar', 82: 'Bihar',
    83: 'Jharkhand', 84: 'Bihar',
  }
  return map[prefix] || 'India'
}
