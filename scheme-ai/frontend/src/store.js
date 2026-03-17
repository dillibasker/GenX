import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ── Auth + User Store (persisted to localStorage) ──
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,          // { id, name, phone, language, profile }
      sessionId: null,     // current chat session UUID
      isLoggedIn: false,

      login: (userData) => {
        const sessionId = crypto.randomUUID()
        set({
          user: userData,
          isLoggedIn: true,
          sessionId,
        })
      },

      logout: () => set({
        user: null,
        isLoggedIn: false,
        sessionId: null,
      }),

      updateLanguage: (lang) => set((state) => ({
        user: state.user ? { ...state.user, language: lang } : state.user,
      })),

      updateProfile: (profile) => set((state) => ({
        user: state.user ? { ...state.user, profile: { ...state.user.profile, ...profile } } : state.user,
      })),

      getLanguage: () => get().user?.language || 'English',
    }),
    {
      name: 'scheme-ai-auth',   // localStorage key
      partialize: (state) => ({  // only persist these fields
        user: state.user,
        isLoggedIn: state.isLoggedIn,
        sessionId: state.sessionId,
      }),
    }
  )
)

// ── Chat Messages Store (persisted to localStorage) ──
export const useChatStore = create(
  persist(
    (set, get) => ({
      messages: [],
      userProfile: {},

      setMessages: (msgs) => set({ messages: msgs }),

      addMessage: (msg) => set((state) => ({
        messages: [...state.messages, msg],
      })),

      setUserProfile: (profile) => set((state) => ({
        userProfile: { ...state.userProfile, ...profile },
      })),

      clearChat: () => set({ messages: [], userProfile: {} }),
    }),
    {
      name: 'scheme-ai-chat',
      partialize: (state) => ({
        messages: state.messages.slice(-50), // keep last 50 messages
        userProfile: state.userProfile,
      }),
    }
  )
)

// ── Applied Schemes Store (persisted to localStorage) ──
export const useSchemeStore = create(
  persist(
    (set, get) => ({
      appliedSchemes: [],  // [{ scheme, status, appliedAt }]
      savedSchemes: [],    // bookmarked schemes

      applyScheme: (scheme) => set((state) => {
        const exists = state.appliedSchemes.find(s => s.scheme.id === scheme.id)
        if (exists) return state
        return {
          appliedSchemes: [
            ...state.appliedSchemes,
            { scheme, status: 'applied', appliedAt: new Date().toISOString() }
          ]
        }
      }),

      updateStatus: (schemeId, status) => set((state) => ({
        appliedSchemes: state.appliedSchemes.map(s =>
          s.scheme.id === schemeId ? { ...s, status } : s
        ),
      })),

      saveScheme: (scheme) => set((state) => {
        const exists = state.savedSchemes.find(s => s.id === scheme.id)
        if (exists) return { savedSchemes: state.savedSchemes.filter(s => s.id !== scheme.id) }
        return { savedSchemes: [...state.savedSchemes, scheme] }
      }),

      isSaved: (schemeId) => get().savedSchemes.some(s => s.id === schemeId),
    }),
    {
      name: 'scheme-ai-schemes',
    }
  )
)
