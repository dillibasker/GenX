import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { RiMenu4Line, RiCloseLine, RiLogoutBoxLine, RiUserLine, RiTranslate2 } from 'react-icons/ri'
import { useAuthStore } from '../store'
import toast from 'react-hot-toast'

const NAV_LINKS = [
  { to: '/chat', label: 'Talk to AI' },
  { to: '/schemes', label: 'Browse Schemes' },
  { to: '/ocr', label: 'Upload ID' },
  { to: '/dashboard', label: 'Dashboard' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user, isLoggedIn, logout } = useAuthStore()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false); setShowUserMenu(false) }, [pathname])

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-tricolor z-50" />

      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-[3px] left-0 right-0 z-40 transition-all duration-300 ${
          scrolled ? 'bg-navy/90 backdrop-blur-xl border-b border-navy-border shadow-2xl' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-10 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-saffron to-gold flex items-center justify-center text-lg font-black shadow-lg group-hover:scale-105 transition-transform">
              🇮🇳
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight">
                Scheme<span className="text-saffron">-AI</span>
              </span>
              <div className="text-[9px] text-[#8A9BB0] tracking-[0.15em] uppercase font-semibold -mt-0.5">
                Welfare Navigator
              </div>
            </div>
          </Link>

          {/* Desktop nav links — only when logged in */}
          {isLoggedIn && (
            <ul className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className={`text-[13px] font-medium px-4 py-2 rounded-lg transition-all duration-200 ${
                      pathname === to
                        ? 'bg-navy-border text-white'
                        : 'text-[#8A9BB0] hover:text-white hover:bg-navy-border/50'
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                {/* Language badge */}
                <div className="flex items-center gap-1.5 text-[11px] text-[#8A9BB0] font-semibold bg-navy-border px-3 py-1.5 rounded-lg">
                  <RiTranslate2 size={12} />
                  <span className="font-devanagari">{user?.language || 'English'}</span>
                </div>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(v => !v)}
                    className="flex items-center gap-2.5 bg-navy-card border border-navy-border rounded-xl px-3 py-2 hover:border-saffron/50 transition-all group"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-saffron to-gold flex items-center justify-center text-navy text-xs font-bold">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-semibold max-w-[100px] truncate">{user?.name}</span>
                    <span className="text-[#8A9BB0] text-xs">▾</span>
                  </button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-56 card py-2 shadow-2xl"
                      >
                        <div className="px-4 py-3 border-b border-navy-border">
                          <div className="text-sm font-bold truncate">{user?.name}</div>
                          <div className="text-xs text-[#8A9BB0] mt-0.5">{user?.phone}</div>
                          {user?.profile?.state && (
                            <div className="text-[10px] text-saffron mt-1">📍 {user.profile.state}</div>
                          )}
                        </div>
                        <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#8A9BB0] hover:text-white hover:bg-navy-border/30 transition-all">
                          <RiUserLine size={15} /> My Dashboard
                        </Link>
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-900/10 transition-all">
                          <RiLogoutBoxLine size={15} /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1.5 text-[11px] text-scheme-green-light font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-scheme-green-light animate-pulse" />
                  22+ Languages Active
                </div>
                <Link to="/login" className="btn-primary text-[13px] px-5 py-2.5">
                  🇮🇳 Login / Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden text-white p-2" onClick={() => setMenuOpen(v => !v)}>
            {menuOpen ? <RiCloseLine size={22} /> : <RiMenu4Line size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-navy-mid border-b border-navy-border overflow-hidden"
            >
              <div className="px-5 py-4 flex flex-col gap-2">
                {isLoggedIn ? (
                  <>
                    <div className="flex items-center gap-3 p-3 card mb-2">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-saffron to-gold flex items-center justify-center text-navy font-bold">
                        {user?.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-bold">{user?.name}</div>
                        <div className="text-[10px] text-saffron font-devanagari">{user?.language}</div>
                      </div>
                    </div>
                    {NAV_LINKS.map(({ to, label }) => (
                      <Link
                        key={to} to={to} onClick={() => setMenuOpen(false)}
                        className={`text-sm font-medium px-4 py-3 rounded-xl transition-all ${
                          pathname === to ? 'bg-navy-border text-white' : 'text-[#8A9BB0] hover:text-white'
                        }`}
                      >
                        {label}
                      </Link>
                    ))}
                    <button onClick={() => { handleLogout(); setMenuOpen(false) }} className="text-sm text-red-400 px-4 py-3 text-left hover:bg-red-900/10 rounded-xl flex items-center gap-2">
                      <RiLogoutBoxLine /> Logout
                    </button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-primary justify-center">
                    🇮🇳 Login / Register
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {showUserMenu && <div className="fixed inset-0 z-30" onClick={() => setShowUserMenu(false)} />}
    </>
  )
}
