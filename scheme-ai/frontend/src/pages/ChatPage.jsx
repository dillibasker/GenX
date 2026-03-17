import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RiMicLine, RiMicOffLine, RiSendPlaneFill, RiTranslate2, RiDeleteBin6Line } from 'react-icons/ri'
import axios from 'axios'
import toast from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'
import { useAuthStore, useChatStore, useSchemeStore } from '../store'

const QUICK_PROMPTS = [
  '👩‍🌾 I am a farmer needing crop support',
  '🎓 Help me find education scholarships',
  '🏠 I need housing scheme assistance',
  '👩‍⚕️ Looking for health insurance schemes',
  '👴 Pension schemes for elderly parents',
  '💼 Schemes for unemployed youth',
]

const LANG_CODES = {
  'English': 'en-IN', 'हिन्दी': 'hi-IN', 'தமிழ்': 'ta-IN',
  'తెలుగు': 'te-IN', 'বাংলা': 'bn-IN', 'मराठी': 'mr-IN', 'ಕನ್ನಡ': 'kn-IN',
}

const LANGUAGES = Object.keys(LANG_CODES)

const INITIAL_MSG = {
  id: 'init',
  role: 'ai',
  content: `नमस्ते! 🙏 I'm **Scheme-AI**, your personal welfare navigator.

Tell me about yourself and your needs — I'll find every government scheme you're eligible for and help you apply.

You can speak or type in **any Indian language**. For example:
- *"I am a 45-year-old farmer in Tamil Nadu with 2 acres of land"*
- *"My daughter needs a scholarship for engineering college"*
- *"I am a widow looking for pension schemes"*

What's your situation? I'm here to help.`,
  timestamp: new Date().toISOString(),
}

export default function ChatPage() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [recording, setRecording] = useState(false)
  const recognitionRef = useRef(null)
  const bottomRef = useRef(null)

  // ── Persisted stores ──
  const { user, sessionId, updateLanguage } = useAuthStore()
  const { messages, addMessage, setMessages, setUserProfile, clearChat } = useChatStore()
  const { applyScheme } = useSchemeStore()

  // Language comes from the logged-in user's profile — persisted!
  const selectedLang = user?.language || 'English'

  // Init chat with greeting if empty
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([INITIAL_MSG])
    }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // ── Change language & persist to user profile ──
  const handleLangChange = (lang) => {
    updateLanguage(lang)
    toast.success(`Language set to ${lang}`)
  }

  // ── Send message ──
  const sendMessage = async (text) => {
    if (!text.trim() || loading) return
    const userMsg = { id: Date.now().toString(), role: 'user', content: text, timestamp: new Date().toISOString() }
    addMessage(userMsg)
    setInput('')
    setLoading(true)

    try {
      const { data } = await axios.post('/api/chat/message', {
        message: text,
        sessionId,
        language: selectedLang,
      })
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: data.reply,
        schemes: data.schemes || [],
        timestamp: new Date().toISOString(),
      }
      addMessage(aiMsg)
      if (data.userProfile) setUserProfile(data.userProfile)
    } catch (err) {
      toast.error('Could not connect to Scheme-AI. Please try again.')
      addMessage({
        id: Date.now().toString(),
        role: 'ai',
        content: 'Sorry, I had trouble connecting. Please check your connection and try again.',
        timestamp: new Date().toISOString(),
      })
    } finally {
      setLoading(false)
    }
  }

  // ── Voice input ──
  const handleVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      toast.error('Voice input not supported. Use Chrome browser.')
      return
    }
    if (recording) { recognitionRef.current?.stop(); setRecording(false); return }

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SR()
    recognition.lang = LANG_CODES[selectedLang] || 'en-IN'
    recognition.continuous = false
    recognition.interimResults = false
    recognition.onresult = (e) => { setInput(e.results[0][0].transcript); setRecording(false) }
    recognition.onerror = () => { setRecording(false); toast.error('Voice recognition failed.') }
    recognition.onend = () => setRecording(false)
    recognitionRef.current = recognition
    recognition.start()
    setRecording(true)
    toast.success(`Listening in ${selectedLang}...`)
  }

  // ── Clear chat ──
  const handleClearChat = () => {
    clearChat()
    setMessages([INITIAL_MSG])
    toast.success('Chat cleared')
  }

  return (
    <div className="pt-[67px] h-screen flex flex-col">
      {/* Header */}
      <div className="bg-navy-mid border-b border-navy-border px-4 md:px-8 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-saffron to-gold flex items-center justify-center text-base flex-shrink-0">🤖</div>
          <div>
            <h1 className="text-sm font-bold">Scheme-AI Welfare Navigator</h1>
            <p className="text-[10px] text-scheme-green-light flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-scheme-green-light animate-pulse" />
              Online · Gemini 1.5 Pro · RAG Active
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          {/* Language selector — changes persist to user profile */}
          <div className="flex items-center gap-1.5">
            <RiTranslate2 className="text-[#8A9BB0] text-sm flex-shrink-0" />
            <div className="flex gap-1 flex-wrap justify-end">
              {LANGUAGES.map(lang => (
                <button
                  key={lang}
                  onClick={() => handleLangChange(lang)}
                  className={`text-[10px] font-semibold px-2 py-1 rounded-lg border transition-all duration-200 font-devanagari ${
                    selectedLang === lang
                      ? 'bg-saffron border-saffron text-navy'
                      : 'bg-transparent border-navy-border text-[#8A9BB0] hover:border-saffron/50 hover:text-saffron'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Clear chat */}
          <button
            onClick={handleClearChat}
            title="Clear chat"
            className="w-8 h-8 flex items-center justify-center border border-navy-border rounded-lg text-[#8A9BB0] hover:text-red-400 hover:border-red-400/50 transition-all"
          >
            <RiDeleteBin6Line size={14} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
        <div className="max-w-3xl mx-auto space-y-5">
          <AnimatePresence initial={false}>
            {messages.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm self-end ${
                  msg.role === 'ai' ? 'bg-gradient-to-br from-saffron to-gold' : 'bg-navy-border'
                }`}>
                  {msg.role === 'ai' ? '🤖' : user?.name?.charAt(0)?.toUpperCase() || '👤'}
                </div>

                <div className="max-w-[75%] space-y-2">
                  {/* Bubble */}
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'ai'
                      ? 'bg-navy-card border border-navy-border rounded-bl-sm'
                      : 'bg-saffron text-navy font-semibold rounded-br-sm'
                  }`}>
                    {msg.role === 'ai' ? (
                      <ReactMarkdown
                        components={{
                          strong: ({ children }) => <strong className="text-saffron-light font-bold">{children}</strong>,
                          li: ({ children }) => <li className="ml-4 list-disc text-[#ccc] mb-1">{children}</li>,
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    ) : msg.content}
                  </div>

                  {/* Scheme cards */}
                  {msg.schemes?.length > 0 && (
                    <div className="space-y-2">
                      {msg.schemes.map((scheme, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.08 }}
                          className="card p-3.5 hover:border-saffron/40 transition-all duration-200 group"
                        >
                          <div className="flex justify-between items-start gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-bold text-white mb-0.5 group-hover:text-saffron transition-colors truncate">{scheme.name}</div>
                              <div className="text-[11px] text-[#8A9BB0]">{scheme.ministry}</div>
                              <div className="text-[11px] text-saffron-light font-semibold mt-1">{scheme.benefit}</div>
                            </div>
                            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                              <span className={`badge text-[10px] ${scheme.eligibility >= 80 ? 'badge-green' : scheme.eligibility >= 60 ? 'badge-gold' : 'badge-saffron'}`}>
                                {scheme.eligibility}% match
                              </span>
                              <button
                                onClick={() => { applyScheme(scheme); toast.success(`${scheme.name} saved!`) }}
                                className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-saffron/10 border border-saffron/30 text-saffron hover:bg-saffron hover:text-navy transition-all"
                              >
                                Apply →
                              </button>
                            </div>
                          </div>
                          <div className="mt-2 h-1 bg-navy rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-saffron to-gold rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${scheme.eligibility}%` }}
                              transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  <div className={`text-[10px] text-[#8A9BB0] px-1 ${msg.role === 'user' ? 'text-right' : ''}`}>
                    {new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          <AnimatePresence>
            {loading && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-saffron to-gold flex items-center justify-center text-sm">🤖</div>
                <div className="bg-navy-card border border-navy-border rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-saffron typing-dot" />
                  <span className="w-2 h-2 rounded-full bg-saffron typing-dot" />
                  <span className="w-2 h-2 rounded-full bg-saffron typing-dot" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-navy-border bg-navy-mid px-4 md:px-8 py-4 flex-shrink-0">
        <div className="max-w-3xl mx-auto">
          {/* Quick prompts */}
          <div className="flex gap-2 flex-wrap mb-3">
            {QUICK_PROMPTS.map((p, i) => (
              <button
                key={i}
                onClick={() => sendMessage(p)}
                disabled={loading}
                className="text-[11px] font-medium px-3 py-1.5 rounded-lg border border-navy-border text-[#8A9BB0] hover:border-saffron/50 hover:text-saffron transition-all duration-200 disabled:opacity-40"
              >
                {p}
              </button>
            ))}
          </div>

          <div className="flex gap-2.5 items-end">
            {/* Voice */}
            <button
              onClick={handleVoice}
              className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all flex-shrink-0 ${
                recording ? 'bg-red-500/20 border-red-500 text-red-400 voice-active' : 'border-navy-border text-[#8A9BB0] hover:border-saffron hover:text-saffron'
              }`}
            >
              {recording ? <RiMicOffLine size={18} /> : <RiMicLine size={18} />}
            </button>

            {/* Text input */}
            <div className="flex-1 bg-navy border border-navy-border rounded-xl flex items-center gap-2 px-4 py-2.5 focus-within:border-saffron transition-colors">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) } }}
                placeholder={`Type in ${selectedLang} or use the mic...`}
                rows={1}
                className="flex-1 bg-transparent outline-none text-white text-sm font-sora placeholder-[#8A9BB0] resize-none"
                style={{ maxHeight: '100px', overflowY: 'auto' }}
              />
            </div>

            {/* Send */}
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="w-11 h-11 rounded-xl bg-saffron hover:bg-saffron-light disabled:opacity-40 flex items-center justify-center text-navy transition-all hover:scale-105 flex-shrink-0"
            >
              <RiSendPlaneFill size={18} />
            </button>
          </div>

          <p className="text-[10px] text-[#8A9BB0] mt-2 text-center">
            Chat is saved automatically · Language "{selectedLang}" is remembered after login ·
            <button onClick={handleClearChat} className="text-red-400/70 hover:text-red-400 ml-1 underline">Clear chat</button>
          </p>
        </div>
      </div>
    </div>
  )
}
