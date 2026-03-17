import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { RiChat3Line, RiFileList2Line, RiScanLine, RiTimeLine, RiTranslate2, RiPencilLine, RiCheckLine } from 'react-icons/ri'
import { useAuthStore, useSchemeStore, useChatStore } from '../store'
import toast from 'react-hot-toast'

const STATUS_STYLE = {
  applied:   'badge-saffron',
  submitted: 'badge-gold',
  approved:  'badge-green',
  rejected:  'text-red-400 bg-red-900/20',
  discovered:'text-[#8A9BB0] bg-navy-border',
}

const STATUS_OPTIONS = ['applied', 'submitted', 'approved', 'rejected']

const LANGUAGES = ['English', 'हिन्दी', 'தமிழ்', 'తెలుగు', 'বাংলা', 'मराठी', 'ಕನ್ನಡ', 'ગુજરાતી']

export default function DashboardPage() {
  const { user, updateLanguage } = useAuthStore()
  const { appliedSchemes, savedSchemes, updateStatus } = useSchemeStore()
  const { messages } = useChatStore()
  const [editingLang, setEditingLang] = useState(false)
  const [activeTab, setActiveTab] = useState('applied')

  const approvedCount  = appliedSchemes.filter(s => s.status === 'approved').length
  const submittedCount = appliedSchemes.filter(s => s.status === 'submitted').length
  const aiMessages     = messages.filter(m => m.role === 'ai').length

  const handleStatusChange = (schemeId, newStatus) => {
    updateStatus(schemeId, newStatus)
    toast.success(`Status updated to ${newStatus}`)
  }

  const handleLangChange = (lang) => {
    updateLanguage(lang)
    setEditingLang(false)
    toast.success(`Language changed to ${lang}`)
  }

  return (
    <div className="pt-24 pb-16 px-5 md:px-10 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="section-label">My Dashboard</div>
        <h1 className="section-title mb-1">
          Welcome back, <span className="text-saffron">{user?.name}</span> 👋
        </h1>
        <p className="section-sub">Track your welfare applications and manage your profile.</p>
      </motion.div>

      {/* Profile card */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card p-5 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-saffron to-gold flex items-center justify-center text-navy text-2xl font-black">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <div className="text-base font-bold">{user?.name}</div>
              <div className="text-xs text-[#8A9BB0] mt-0.5">📱 {user?.phone}</div>
              {user?.profile?.state && <div className="text-xs text-[#8A9BB0]">📍 {user.profile.state}</div>}
              {user?.profile?.occupation && <div className="text-xs text-[#8A9BB0]">💼 {user.profile.occupation}</div>}
            </div>
          </div>

          {/* Language section */}
          <div className="flex flex-col items-end gap-2">
            <div className="text-[10px] text-[#8A9BB0] uppercase tracking-wider font-semibold">AI Language</div>
            {!editingLang ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-saffron/10 border border-saffron/30 text-saffron px-3 py-1.5 rounded-lg">
                  <RiTranslate2 size={13} />
                  <span className="text-sm font-bold font-devanagari">{user?.language || 'English'}</span>
                </div>
                <button
                  onClick={() => setEditingLang(true)}
                  className="w-8 h-8 flex items-center justify-center border border-navy-border rounded-lg text-[#8A9BB0] hover:text-saffron hover:border-saffron/50 transition-all"
                >
                  <RiPencilLine size={13} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 items-end">
                <div className="flex flex-wrap gap-1.5 justify-end max-w-[260px]">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang}
                      onClick={() => handleLangChange(lang)}
                      className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg border transition-all font-devanagari ${
                        user?.language === lang
                          ? 'bg-saffron border-saffron text-navy'
                          : 'border-navy-border text-[#8A9BB0] hover:border-saffron/50 hover:text-saffron'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
                <button onClick={() => setEditingLang(false)} className="text-[10px] text-[#8A9BB0] hover:text-white transition-colors">
                  Cancel
                </button>
              </div>
            )}
            <p className="text-[10px] text-[#8A9BB0]">Change only here — remembered forever</p>
          </div>
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { num: appliedSchemes.length, label: 'Schemes Applied', color: 'text-saffron' },
          { num: approvedCount,         label: 'Approved & Receiving', color: 'text-scheme-green-light' },
          { num: savedSchemes.length,   label: 'Saved Schemes', color: 'text-gold' },
          { num: aiMessages,            label: 'AI Interactions', color: 'text-teal' },
        ].map(({ num, label, color }, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }} className="card p-5 text-center">
            <div className={`text-3xl font-extrabold tracking-tight ${color} mb-1`}>{num}</div>
            <div className="text-[11px] text-[#8A9BB0] leading-snug">{label}</div>
          </motion.div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { icon: <RiChat3Line size={20} />, title: 'Talk to AI', desc: 'Find more schemes', to: '/chat', color: 'from-saffron/15 to-transparent' },
          { icon: <RiFileList2Line size={20} />, title: 'Browse Schemes', desc: '20+ schemes database', to: '/schemes', color: 'from-scheme-green/15 to-transparent' },
          { icon: <RiScanLine size={20} />, title: 'Upload ID', desc: 'Auto-fill your forms', to: '/ocr', color: 'from-teal/15 to-transparent' },
        ].map(({ icon, title, desc, to, color }, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.06 }}>
            <Link to={to} className={`card p-5 flex items-center gap-4 hover:border-saffron/40 hover:-translate-y-0.5 transition-all duration-200 bg-gradient-to-br ${color} block`}>
              <div className="text-saffron">{icon}</div>
              <div>
                <div className="text-sm font-bold">{title}</div>
                <div className="text-xs text-[#8A9BB0]">{desc}</div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <div className="flex bg-navy-card border border-navy-border rounded-xl p-1 mb-5 w-fit">
          {[
            { id: 'applied', label: `Applied (${appliedSchemes.length})` },
            { id: 'saved',   label: `Saved (${savedSchemes.length})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab.id ? 'bg-saffron text-navy' : 'text-[#8A9BB0] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Applied schemes */}
        {activeTab === 'applied' && (
          <>
            {appliedSchemes.length === 0 ? (
              <div className="card p-10 text-center">
                <div className="text-3xl mb-3">📋</div>
                <p className="text-sm text-[#8A9BB0] mb-4">No schemes applied yet. Browse schemes or talk to AI to get started.</p>
                <Link to="/schemes" className="btn-primary mx-auto">Browse Schemes</Link>
              </div>
            ) : (
              <div className="card overflow-hidden">
                {appliedSchemes.map((s, i) => (
                  <div key={s.scheme.id} className={`flex items-center justify-between px-5 py-4 gap-4 ${i < appliedSchemes.length - 1 ? 'border-b border-navy-border' : ''}`}>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold mb-0.5 truncate">{s.scheme.name}</div>
                      <div className="text-xs text-[#8A9BB0] flex items-center gap-1.5">
                        <RiTimeLine size={11} />
                        {new Date(s.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        <span>·</span>
                        <span className="text-saffron">{s.scheme.benefit}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`badge text-[10px] ${STATUS_STYLE[s.status]}`}>
                        {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                      </span>
                      {/* Status updater */}
                      <select
                        value={s.status}
                        onChange={e => handleStatusChange(s.scheme.id, e.target.value)}
                        className="text-[10px] bg-navy border border-navy-border rounded-lg px-2 py-1 text-[#8A9BB0] outline-none cursor-pointer hover:border-saffron/50 transition-colors"
                        onClick={e => e.stopPropagation()}
                      >
                        {STATUS_OPTIONS.map(opt => (
                          <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Saved schemes */}
        {activeTab === 'saved' && (
          <>
            {savedSchemes.length === 0 ? (
              <div className="card p-10 text-center">
                <div className="text-3xl mb-3">❤️</div>
                <p className="text-sm text-[#8A9BB0] mb-4">No saved schemes yet. Heart any scheme to save it here.</p>
                <Link to="/schemes" className="btn-primary mx-auto">Browse Schemes</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedSchemes.map((scheme, i) => (
                  <motion.div key={scheme.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card p-4">
                    <div className="text-sm font-bold mb-1">{scheme.name}</div>
                    <div className="text-xs text-[#8A9BB0] mb-2">{scheme.ministry}</div>
                    <div className="text-sm font-bold text-saffron mb-3">{scheme.benefit}</div>
                    <div className="flex gap-2">
                      <a href={scheme.apply_link} target="_blank" rel="noopener noreferrer" className="btn-primary text-xs px-3 py-2 flex-1 justify-center">Apply Now</a>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  )
}
