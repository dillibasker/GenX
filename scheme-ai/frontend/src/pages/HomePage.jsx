import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'

const STATS = [
  { num: '1,000+', label: 'Welfare Schemes' },
  { num: '500M+', label: 'Citizens Targeted' },
  { num: '22+', label: 'Indian Languages' },
  { num: '30s', label: 'Avg. Time to Apply' },
]

const FEATURES = [
  {
    icon: '🎙️',
    color: 'from-orange-500/20 to-orange-600/5',
    border: 'hover:border-saffron/40',
    tag: 'Pillar 1',
    title: 'Voice-First Intake',
    desc: 'Speak your life situation in any Indian language. AI silently extracts your eligibility profile — zero forms, zero dropdowns, zero literacy required.',
  },
  {
    icon: '🔍',
    color: 'from-green-700/20 to-green-800/5',
    border: 'hover:border-scheme-green/40',
    tag: 'Pillar 2',
    title: 'Live RAG Scheme Match',
    desc: 'LangChain + ChromaDB retrieves real-time govt. gazette PDFs. Each match shows eligibility score with plain-language reason — no legal jargon.',
  },
  {
    icon: '📄',
    color: 'from-yellow-600/20 to-yellow-700/5',
    border: 'hover:border-gold/40',
    tag: 'Pillar 3',
    title: 'Aadhaar OCR Auto-Fill',
    desc: 'Upload your Aadhaar / Voter ID photo. Tesseract.js extracts Name, DOB, Address and auto-populates all govt. PDF forms — eliminates #1 rejection cause.',
  },
  {
    icon: '✍️',
    color: 'from-teal-600/20 to-teal-700/5',
    border: 'hover:border-teal/40',
    tag: 'Pillar 4',
    title: 'Signature Highlighter',
    desc: 'AI marks exactly where to sign or thumbprint on every form — zero confusion for first-time applicants navigating complex paperwork.',
  },
  {
    icon: '🤖',
    color: 'from-purple-600/20 to-purple-700/5',
    border: 'hover:border-purple-400/40',
    tag: 'Innovation',
    title: 'Emotional AI',
    desc: 'Claude\'s 5th prompt layer detects confusion or frustration in real-time and auto-simplifies the response. No other govt. tool does this.',
  },
  {
    icon: '🤝',
    color: 'from-blue-600/20 to-blue-700/5',
    border: 'hover:border-blue-400/40',
    tag: 'V2 Feature',
    title: 'Caregiver Mode',
    desc: 'NGO workers or family members can co-navigate on behalf of elderly or illiterate citizens — critical for last-mile trust and reach.',
  },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'You Speak, We Listen',
    desc: 'Tell the AI your situation in your language — Tamil, Hindi, Bengali, Telugu and 18 more. Web Speech API + Whisper ASR transcribes your voice.',
    detail: 'Whisper ASR · 22+ languages · Real-time',
    color: 'text-saffron border-saffron/50',
  },
  {
    step: '02',
    title: 'AI Builds Your Profile',
    desc: 'Claude\'s 5-layer prompt chain silently extracts age, income, state, caste, occupation and life events from natural conversation — no forms.',
    detail: 'Claude Sonnet · Profile Extract · Zero Forms',
    color: 'text-gold border-gold/50',
  },
  {
    step: '03',
    title: 'Schemes Are Matched',
    desc: 'RAG engine retrieves top-20 matching schemes from 500k+ govt. gazette vectors in ChromaDB using HuggingFace embeddings.',
    detail: 'LangChain RAG · ChromaDB · Live Data',
    color: 'text-scheme-green-light border-scheme-green-light/50',
  },
  {
    step: '04',
    title: 'Forms Are Auto-Filled',
    desc: 'Upload any ID document — Tesseract.js extracts your data and PDFLib auto-injects it into official government application forms.',
    detail: 'Tesseract.js · PDFLib · Google Vision',
    color: 'text-teal border-teal/50',
  },
  {
    step: '05',
    title: 'Share in 30 Seconds',
    desc: 'Pre-filled form is ready to share via WhatsApp or download. For villages with no internet, an SMS fallback delivers the roadmap.',
    detail: 'WhatsApp Share · SMS Fallback · Offline PWA',
    color: 'text-blue-400 border-blue-400/50',
  },
]

const LANGUAGES = [
  { name: 'हिन्दी', romanized: 'Hindi' },
  { name: 'தமிழ்', romanized: 'Tamil' },
  { name: 'తెలుగు', romanized: 'Telugu' },
  { name: 'বাংলা', romanized: 'Bengali' },
  { name: 'मराठी', romanized: 'Marathi' },
  { name: 'ಕನ್ನಡ', romanized: 'Kannada' },
  { name: 'ગુજરાતી', romanized: 'Gujarati' },
  { name: 'ਪੰਜਾਬੀ', romanized: 'Punjabi' },
  { name: 'മലയാളം', romanized: 'Malayalam' },
  { name: 'ଓଡ଼ିଆ', romanized: 'Odia' },
  { name: 'অসমীয়া', romanized: 'Assamese' },
  { name: 'English', romanized: 'English' },
]

function FadeIn({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function HomePage() {
  return (
    <div className="pt-16">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-5 py-28 overflow-hidden">
        {/* Background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[500px] h-[500px] rounded-full bg-saffron/10 blur-[100px] -top-32 -left-32 animate-float" />
          <div className="absolute w-[400px] h-[400px] rounded-full bg-scheme-green/8 blur-[80px] top-48 -right-20" style={{ animationDelay: '2s', animation: 'float 8s ease-in-out infinite' }} />
          <div className="absolute w-[300px] h-[300px] rounded-full bg-teal/8 blur-[80px] bottom-20 left-1/3" style={{ animationDelay: '4s', animation: 'float 7s ease-in-out infinite' }} />
          {/* Ashoka Chakra ring */}
          <div className="absolute w-[700px] h-[700px] rounded-full border border-saffron/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 chakra-spin" />
          <div className="absolute w-[500px] h-[500px] rounded-full border border-scheme-green/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ animation: 'chakraSpin 15s linear infinite reverse' }} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 bg-saffron/10 border border-saffron/30 text-saffron-light text-[11px] font-bold uppercase tracking-[0.15em] px-4 py-1.5 rounded-full mb-7 relative z-10"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-saffron animate-pulse" />
          Generative AI · Social Impact · HackNova 3.0
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-[clamp(38px,6vw,78px)] font-extrabold leading-[1.04] tracking-[-2.5px] text-center max-w-[880px] relative z-10"
        >
          Every Indian Deserves<br />
          Their{' '}
          <span className="text-saffron">Welfare Rights</span>.<br />
          <span className="text-scheme-green-light">In Their Language.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-[15px] text-[#8A9BB0] text-center max-w-[540px] leading-relaxed mt-5 relative z-10"
        >
          Voice-first AI agent that helps rural citizens discover, understand & apply for 1,000+ government welfare schemes — with zero forms, zero office visits, zero literacy barriers.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex gap-3 mt-9 flex-wrap justify-center relative z-10"
        >
          <Link to="/chat" className="btn-primary text-sm px-7 py-3.5 shadow-[0_0_30px_rgba(255,107,0,0.3)]">
            🎙️ Start Conversation
          </Link>
          <Link to="/schemes" className="btn-secondary text-sm px-7 py-3.5">
            📋 Browse 1,000+ Schemes
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex gap-10 md:gap-16 mt-16 flex-wrap justify-center relative z-10"
        >
          {STATS.map(({ num, label }, i) => (
            <div key={i} className="text-center">
              <div className="text-[28px] md:text-[34px] font-extrabold tracking-tight">
                {num.includes('+') ? (
                  <>{num.replace('+', '')}<span className="text-saffron">+</span></>
                ) : (
                  <>{num}</>
                )}
              </div>
              <div className="text-[11px] text-[#8A9BB0] uppercase tracking-[0.1em] mt-1 font-semibold">{label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── FEATURES ── */}
      <section className="px-5 md:px-10 py-24 max-w-6xl mx-auto">
        <FadeIn className="text-center max-w-xl mx-auto mb-14">
          <div className="section-label">Core Pillars</div>
          <h2 className="section-title mb-3">
            Built for <span className="text-saffron">Bharat</span>, Not Browsers
          </h2>
          <p className="section-sub">Three pillars that eliminate every barrier between citizens and their rights.</p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div className={`card p-7 h-full transition-all duration-300 cursor-default ${f.border} hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)]`}>
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-2xl mb-5 border border-white/5`}>
                  {f.icon}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-saffron mb-2">{f.tag}</div>
                <h3 className="text-base font-bold mb-2.5 tracking-tight">{f.title}</h3>
                <p className="text-[13px] text-[#8A9BB0] leading-relaxed">{f.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="px-5 md:px-10 py-24 max-w-3xl mx-auto">
        <FadeIn className="mb-14">
          <div className="section-label">The Flow</div>
          <h2 className="section-title mb-3">
            From Voice to <span className="text-saffron">Pre-Filled Form</span>
          </h2>
          <p className="section-sub max-w-lg">A seamless 5-step journey — under 30 seconds from speaking to a ready-to-submit application.</p>
        </FadeIn>

        <div className="relative">
          <div className="absolute left-7 top-0 bottom-0 w-px bg-gradient-to-b from-saffron/40 via-gold/30 to-teal/40" />
          {HOW_IT_WORKS.map((s, i) => (
            <FadeIn key={i} delay={i * 0.1} className="relative flex gap-7 mb-12 last:mb-0">
              <div className={`relative z-10 w-14 h-14 rounded-full border-2 ${s.color} bg-navy flex items-center justify-center font-mono text-xs font-bold flex-shrink-0`}>
                {s.step}
              </div>
              <div className="pt-2 flex-1">
                <h3 className="text-lg font-bold tracking-tight mb-2">{s.title}</h3>
                <p className="text-[13px] text-[#8A9BB0] leading-relaxed mb-3">{s.desc}</p>
                <div className="inline-flex items-center gap-2 bg-navy-card border border-navy-border rounded-lg px-3 py-1.5 text-[11px] font-mono text-[#8A9BB0]">
                  <span className="w-1.5 h-1.5 rounded-full bg-saffron/60" />
                  {s.detail}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── LANGUAGE SUPPORT ── */}
      <section className="px-5 py-20 text-center">
        <FadeIn>
          <div className="section-label">Multilingual</div>
          <h2 className="section-title mb-3">
            Speak in <span className="text-saffron">Your Language</span>
          </h2>
          <p className="section-sub max-w-lg mx-auto mb-10">
            From Kanyakumari to Kashmir — every citizen deserves to be heard in their mother tongue.
          </p>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="flex flex-wrap gap-3 justify-center max-w-3xl mx-auto">
            {LANGUAGES.map(({ name, romanized }, i) => (
              <div
                key={i}
                className="card px-5 py-2.5 text-sm font-semibold hover:border-saffron/40 hover:text-saffron transition-all duration-200 cursor-default hover:scale-105 font-devanagari"
              >
                {name}
                <span className="text-[10px] text-[#8A9BB0] ml-1.5 font-sora">({romanized})</span>
              </div>
            ))}
            <div className="card px-5 py-2.5 text-sm font-semibold text-[#8A9BB0] border-dashed">
              + 10 more regional languages
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── IMPACT ── */}
      <section className="px-5 md:px-10 py-24 max-w-5xl mx-auto">
        <FadeIn className="text-center max-w-xl mx-auto mb-14">
          <div className="section-label">Impact Vision</div>
          <h2 className="section-title mb-3">
            Unlocking <span className="text-saffron">₹ Lakh Crore</span> in Welfare
          </h2>
          <p className="section-sub">Significant welfare funds go unclaimed annually due to information & access barriers. We're here to change that.</p>
        </FadeIn>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { num: '500M+', label: 'Underserved Indians Targeted', color: 'text-saffron' },
            { num: '1,000+', label: 'Central & State Schemes', color: 'text-gold' },
            { num: '28', label: 'States to Scale Across', color: 'text-scheme-green-light' },
            { num: '₹ Lakh Cr', label: 'Annual Unclaimed Benefits', color: 'text-teal' },
          ].map(({ num, label, color }, i) => (
            <FadeIn key={i} delay={i * 0.08}>
              <div className="card p-6 text-center hover:-translate-y-1 transition-transform duration-300">
                <div className={`text-[28px] md:text-[32px] font-extrabold tracking-tight ${color} mb-2`}>{num}</div>
                <div className="text-[11px] text-[#8A9BB0] leading-snug">{label}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="px-5 py-20 max-w-3xl mx-auto text-center">
        <FadeIn>
          <div className="card p-10 md:p-14 relative overflow-hidden border-saffron/20 glow-border">
            <div className="absolute inset-0 bg-gradient-to-br from-saffron/5 to-transparent" />
            <div className="relative z-10">
              <div className="text-4xl mb-4">🇮🇳</div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-4">
                Ready to Discover Your Welfare Rights?
              </h2>
              <p className="text-[#8A9BB0] text-sm mb-8 max-w-md mx-auto leading-relaxed">
                Just speak. Scheme-AI does the rest — matching, filling, and guiding you to what's rightfully yours.
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Link to="/chat" className="btn-primary px-8 py-3.5 shadow-[0_0_40px_rgba(255,107,0,0.35)]">
                  🎙️ Talk to Scheme-AI Now
                </Link>
                <Link to="/ocr" className="btn-secondary px-8 py-3.5">
                  📤 Upload Aadhaar ID
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-navy-border px-5 md:px-10 py-10 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-saffron to-gold flex items-center justify-center text-sm">🇮🇳</div>
          <div>
            <div className="text-sm font-bold">Scheme<span className="text-saffron">-AI</span></div>
            <div className="text-[10px] text-[#8A9BB0]">Built at HackNova 3.0 · Jaya Engineering College</div>
          </div>
        </div>
        <div className="text-[11px] text-[#8A9BB0] text-center">
          Team: Dilli Basker M · Moulitha C · Mohan B · Jothika J
        </div>
        <div className="text-[11px] text-[#8A9BB0]">
          Powered by Gemini 1.5 · LangChain · MongoDB · Vite
        </div>
      </footer>
      <div className="h-[3px] bg-tricolor" />
    </div>
  )
}
