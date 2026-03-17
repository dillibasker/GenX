/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        devanagari: ['Noto Sans Devanagari', 'sans-serif'],
      },
      colors: {
        saffron: {
          DEFAULT: '#FF6B00',
          light: '#FF9A45',
          dark: '#CC5500',
        },
        'scheme-green': {
          DEFAULT: '#138808',
          light: '#2DB52D',
        },
        navy: {
          DEFAULT: '#0A1628',
          mid: '#0F2040',
          card: '#142035',
          border: '#1E3050',
        },
        gold: '#D4AF37',
        teal: '#00C9A7',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease infinite',
        'slide-up': 'slideUp 0.4s ease',
        'fade-in': 'fadeIn 0.4s ease',
        'spin-slow': 'spin 30s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(16px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
      backgroundImage: {
        'tricolor': 'linear-gradient(90deg, #FF6B00 33.3%, #ffffff 33.3% 66.6%, #138808 66.6%)',
      }
    },
  },
  plugins: [],
}
