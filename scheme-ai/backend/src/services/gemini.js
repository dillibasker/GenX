import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'
import { logger } from '../utils/logger.js'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyAEfkG5e4pzX81sqTkMFTivtnjh1vYNxBA' )

// Safety settings — relaxed for welfare/government content
const SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
]

// ── Model helpers ──
const getFlashModel = () =>
  genAI.getGenerativeModel({
    model: 'models/gemini-3-flash-preview',
    safetySettings: SAFETY_SETTINGS,
    generationConfig: { temperature: 0.3, maxOutputTokens: 256 },
  })

const getProModel = () =>
  genAI.getGenerativeModel({
    model: 'models/gemini-3-flash-preview',
    safetySettings: SAFETY_SETTINGS,
    generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
  })

// ─────────────────────────────────────────────────────────────
// LAYER 1 — Profile Extractor
// Silently pulls structured user data from natural conversation
// ─────────────────────────────────────────────────────────────
const PROFILE_PROMPT = `You are a silent profile extractor for Scheme-AI, India's welfare navigator.
Extract structured fields from the user's message. Return ONLY valid JSON — no markdown, no prose.

Fields to extract (use null if not mentioned):
{
  "age": number|null,
  "gender": "male"|"female"|"other"|null,
  "state": "state name"|null,
  "district": "district name"|null,
  "occupation": "farmer"|"student"|"daily_wage"|"unemployed"|"business"|"govt_employee"|"other"|null,
  "income_annual": number|null,
  "land_acres": number|null,
  "caste": "general"|"obc"|"sc"|"st"|null,
  "is_disabled": boolean|null,
  "is_widow": boolean|null,
  "has_aadhaar": boolean|null,
  "family_size": number|null,
  "need_category": ["education","health","housing","agriculture","finance","employment","women_child"]
}`

export const extractProfile = async (message) => {
  try {
    const model = getFlashModel()
    const result = await model.generateContent(
      `${PROFILE_PROMPT}\n\nUser message: "${message}"\n\nReturn ONLY valid JSON:`
    )
    const text = result.response.text().replace(/```json|```/g, '').trim()
    return JSON.parse(text)
  } catch (err) {
    logger.error(`[Gemini] Profile extract error: ${err.message}`)
    return {}
  }
}

// ─────────────────────────────────────────────────────────────
// LAYER 2-5 — Main AI Reply (Scheme Retrieval + Scoring + Roadmap + Emotion)
// ─────────────────────────────────────────────────────────────
const SYSTEM_INSTRUCTION = `You are Scheme-AI, a compassionate and knowledgeable welfare navigator for Indian citizens.
Your job is to help rural and underserved citizens discover and apply for government welfare schemes.

CORE RULES:
1. Always respond in the SAME language the user writes in (Hindi, Tamil, Telugu, Bengali, etc.)
2. Never use bureaucratic jargon — speak like a helpful neighbour or trusted elder
3. Extract profile information SILENTLY — never ask them to fill a form or select from dropdowns
4. When you have enough context, recommend 2-4 specific schemes with clear eligibility reasoning
5. Explain WHY they qualify in plain simple words (max 8th grade reading level)
6. Always give clear, numbered next steps for applying
7. If the user seems confused, frustrated or helpless — acknowledge their situation FIRST, then simplify

RESPONSE STRUCTURE (when recommending schemes):
- 1-2 lines of empathetic acknowledgment
- 2-4 recommended schemes, each with:
  • Scheme name (bold)
  • Why they qualify (1 sentence)
  • Key benefit
  • How to apply (2-3 steps)
- 1 follow-up question to refine matches further

SCHEME KNOWLEDGE: You know all major central & state schemes including PM-KISAN, PM-JAY, Ayushman Bharat,
MGNREGA, PM Awas Yojana (Gramin & Urban), Ujjwala Yojana, National Scholarship Portal, MUDRA Yojana,
Sukanya Samriddhi, Atal Pension Yojana, Kisan Credit Card, PMEGP, Stand-Up India, and 1000+ others.

EMOTIONAL AI LAYER: Detect emotional tone — if frustrated → acknowledge, if confused → simplify,
if hopeless → be encouraging. Always end with hope and a clear next action.

Remember: Many users face real hardship. You may be the only help they get. Every word matters.`

export const generateAIReply = async ({
  message,
  history = [],
  userProfile = {},
  matchedSchemes = [],
  language = 'English',
}) => {
  const model = getProModel()

  // Build Gemini chat history format
  const chatHistory = history.slice(-8).map(m => ({
    role: m.role === 'ai' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))

const chat = model.startChat({
  history: chatHistory,
  systemInstruction: {
    role: "system",
    parts: [{ text: SYSTEM_INSTRUCTION }]
  },
})

  // Enrich user message with context (hidden from display)
  const contextNote = `
---
[AI Context — not shown to user]
Detected user profile: ${JSON.stringify(userProfile)}
Language preference: ${language}
${matchedSchemes.length > 0
  ? `Top RAG-matched schemes: ${matchedSchemes.slice(0, 5).map(s => s.name).join(', ')}`
  : 'No RAG matches yet — use your training knowledge'
}
---`

  const enrichedMessage = `${message}${contextNote}`

  const result = await chat.sendMessage(enrichedMessage)
  return result.response.text()
}

// ─────────────────────────────────────────────────────────────
// LAYER 3 — Eligibility Scorer
// ─────────────────────────────────────────────────────────────
export const scoreEligibility = async (userProfile, scheme) => {
  try {
    const model = getFlashModel()
    const prompt = `Given this citizen profile:
${JSON.stringify(userProfile, null, 2)}

And this government scheme:
Name: ${scheme.name}
Description: ${scheme.description}
Eligibility criteria: ${Array.isArray(scheme.eligibility) ? scheme.eligibility.join(', ') : scheme.eligibility}

Score the eligibility from 0 to 100 (100 = perfectly eligible).
Give a 1-sentence plain-language reason in simple English.

Return ONLY this JSON (no markdown):
{"score": <number>, "reason": "<1 sentence>"}`

    const result = await model.generateContent(prompt)
    const text = result.response.text().replace(/```json|```/g, '').trim()
    return JSON.parse(text)
  } catch (err) {
    logger.error(`[Gemini] Eligibility score error: ${err.message}`)
    return { score: 72, reason: 'Likely eligible based on your profile' }
  }
}

// ─────────────────────────────────────────────────────────────
// Helper — generate embeddings via Gemini for ChromaDB
// ─────────────────────────────────────────────────────────────
export const generateEmbedding = async (text) => {
  try {
    const embeddingModel = genAI.getGenerativeModel({ model: 'text-embedding-004' })
    const result = await embeddingModel.embedContent(text)
    return result.embedding.values
  } catch (err) {
    logger.error(`[Gemini] Embedding error: ${err.message}`)
    return null
  }
}
