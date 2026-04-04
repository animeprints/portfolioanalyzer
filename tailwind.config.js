/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Premium Dark Palette - Cyber-Luxury
        background: {
          DEFAULT: '#050505',
          elevated: '#0a0a0a',
          surface: '#121212',
          muted: '#1a1a1a',
        },
        // Muted Gold - Primary accent
        gold: {
          50: '#fdf8f3',
          100: '#f9eeda',
          200: '#f4dcc0',
          300: '#ecc99e',
          400: '#e0b57a',
          500: '#d4a574', // PRIMARY
          600: '#c48a63',
          700: '#a86e52',
          800: '#8c5742',
          900: '#724438',
        },
        // Electric Violet - Interactive accent
        violet: {
          50: '#f3e8ff',
          100: '#e5d3ff',
          200: '#d0b3ff',
          300: '#b986ff',
          400: '#a855f7',
          500: '#9333ea', // ACCENT
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        // Cool Silver - Secondary
        silver: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        // Surface colors with blur
        surface: {
          DEFAULT: 'rgba(18, 18, 18, 0.8)',
          elevated: 'rgba(26, 26, 26, 0.9)',
          glass: 'rgba(255, 255, 255, 0.03)',
          glassHover: 'rgba(255, 255, 255, 0.06)',
        },
      },
      fontFamily: {
        // Premium font pairing
        display: ['Syne', 'sans-serif'], // Bold, artistic headings
        body: ['Manrope', 'sans-serif'], // Clean, modern body
        accent: ['Playfair Display', 'serif'], // Elegant accents
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'display': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'hero': ['5rem', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
        'section': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
      },
      boxShadow: {
        'glow': '0 0 40px rgba(212, 165, 116, 0.15)',
        'glow-strong': '0 0 60px rgba(212, 165, 116, 0.25)',
        'inner-glow': 'inset 0 0 20px rgba(212, 165, 116, 0.1)',
      },
      backdropBlur: {
        xs: '2px',
        'glass': '12px',
        'heavy': '24px',
      },
      animation: {
        'float': 'float 8s ease-in-out infinite',
        'float-slow': 'float 12s ease-in-out infinite',
        'glow-pulse': 'glowPulse 4s ease-in-out infinite',
        'reveal': 'reveal 1s ease-out forwards',
        'stagger-in': 'staggerIn 0.8s ease-out forwards',
        'parallax': 'parallax 20s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) translateZ(0)' },
          '50%': { transform: 'translateY(-30px) translateZ(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212, 165, 116, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(212, 165, 116, 0.4)' },
        },
        reveal: {
          '0%': { opacity: 0, transform: 'translateY(30px) translateZ(0)' },
          '100%': { opacity: 1, transform: 'translateY(0px) translateZ(0)' },
        },
        staggerIn: {
          '0%': { opacity: 0, transform: 'translateY(20px) translateZ(0)' },
          '100%': { opacity: 1, transform: 'translateY(0px) translateZ(0)' },
        },
        parallax: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backgroundImage: {
        'mesh-gradient': 'radial-gradient(at 0% 0%, rgba(212, 165, 116, 0.08) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(147, 51, 234, 0.08) 0px, transparent 50%)',
        'mesh-gradient-alt': 'radial-gradient(at 20% 30%, rgba(212, 165, 116, 0.12) 0px, transparent 40%), radial-gradient(at 80% 70%, rgba(147, 51, 234, 0.12) 0px, transparent 40%)',
      },
    },
  },
  plugins: [],
}
