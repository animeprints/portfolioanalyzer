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
        // Pure Black Dark Mode - Ultra Premium
        background: {
          DEFAULT: '#000000',
          elevated: '#0a0a0a',
          surface: '#0f0f0f',
          muted: '#1a1a1a',
        },
        // Vibrant Gold - Primary accent (brightened for black)
        gold: {
          50: '#fffdf9',
          100: '#fff5e6',
          200: '#ffedd0',
          300: '#fee3af',
          400: '#fcd78a',
          500: '#e9c862', // PRIMARY - brighter
          600: '#d9a840',
          700: '#c2862c',
          800: '#a46922',
          900: '#8a571d',
        },
        // Electric Violet - Interactive accent (more vibrant)
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
        // Bright Cyan - New accent for pop
        cyan: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#06b6d4',
          500: '#0891b2',
          600: '#0e7490',
          700: '#155e75',
          800: '#164e63',
          900: '#134e4a',
        },
        // Silver - Lifted for black background
        silver: {
          50: '#ffffff',
          100: '#f8fafc',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        // Surface colors with blur - lifted for black
        surface: {
          DEFAULT: 'rgba(15, 15, 15, 0.8)',
          elevated: 'rgba(26, 26, 26, 0.9)',
          glass: 'rgba(255, 255, 255, 0.04)',
          glassHover: 'rgba(255, 255, 255, 0.08)',
          highlight: 'rgba(255, 255, 255, 0.02)',
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
        'display': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
        'hero': ['6.5rem', { lineHeight: '1.05', letterSpacing: '-0.04em' }],
        'section': ['3rem', { lineHeight: '1.15', letterSpacing: '-0.025em' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
      },
      boxShadow: {
        'glow': '0 0 40px rgba(233, 200, 98, 0.2)',
        'glow-strong': '0 0 60px rgba(233, 200, 98, 0.35)',
        'glow-ultra': '0 0 80px rgba(233, 200, 98, 0.5)',
        'inner-glow': 'inset 0 0 20px rgba(233, 200, 98, 0.15)',
        'glow-purple': '0 0 50px rgba(147, 51, 234, 0.3)',
        'glow-cyan': '0 0 40px rgba(6, 182, 212, 0.25)',
        'float': '0 20px 60px -10px rgba(0, 0, 0, 0.8)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
      },
      backdropBlur: {
        xs: '2px',
        'glass': '12px',
        'heavy': '24px',
        'light': '4px',
      },
      animation: {
        'float': 'float 8s ease-in-out infinite',
        'float-slow': 'float 12s ease-in-out infinite',
        'glow-pulse': 'glowPulse 4s ease-in-out infinite',
        'reveal': 'reveal 1s ease-out forwards',
        'stagger-in': 'staggerIn 0.8s ease-out forwards',
        'parallax': 'parallax 20s ease-in-out infinite',
        // Aurora mesh gradient animation
        'aurora': 'aurora 15s ease-in-out infinite alternate',
        'gradient-flow': 'gradientFlow 8s ease infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
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
        aurora: {
          '0%': { backgroundPosition: '0% 50%', filter: 'hue-rotate(0deg)' },
          '25%': { backgroundPosition: '100% 50%', filter: 'hue-rotate(10deg)' },
          '50%': { backgroundPosition: '0% 50%', filter: 'hue-rotate(20deg)' },
          '75%': { backgroundPosition: '100% 50%', filter: 'hue-rotate(10deg)' },
          '100%': { backgroundPosition: '0% 50%', filter: 'hue-rotate(0deg)' },
        },
        gradientFlow: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backgroundImage: {
        // Intense aurora for pure black
        'aurora': 'radial-gradient(ellipse at 20% 30%, rgba(233, 200, 98, 0.2) 0%, transparent 40%), radial-gradient(ellipse at 80% 70%, rgba(147, 51, 234, 0.25) 0%, transparent 40%), radial-gradient(ellipse at 40% 80%, rgba(6, 182, 212, 0.15) 0%, transparent 50%), linear-gradient(135deg, rgba(233, 200, 98, 0.08) 0%, rgba(147, 51, 234, 0.1) 50%, rgba(6, 182, 212, 0.08) 100%)',
        'aurora-2': 'radial-gradient(ellipse at 80% 20%, rgba(147, 51, 234, 0.3) 0%, transparent 35%), radial-gradient(ellipse at 20% 80%, rgba(233, 200, 98, 0.25) 0%, transparent 35%), radial-gradient(ellipse at 50% 50%, rgba(6, 182, 212, 0.12) 0%, transparent 50%)',
        'aurora-cta': 'radial-gradient(ellipse at 30% 20%, rgba(233, 200, 98, 0.3) 0%, transparent 45%), radial-gradient(ellipse at 70% 80%, rgba(147, 51, 234, 0.3) 0%, transparent 45%), radial-gradient(ellipse at 50% 50%, rgba(6, 182, 212, 0.15) 0%, transparent 55%)',
        // Gradient blobs with higher intensity
        'gradient-blob-1': 'radial-gradient(circle at 30% 50%, rgba(233, 200, 98, 0.5) 0%, transparent 60%)',
        'gradient-blob-2': 'radial-gradient(circle at 70% 50%, rgba(147, 51, 234, 0.5) 0%, transparent 60%)',
        'gradient-blob-3': 'radial-gradient(circle at 50% 80%, rgba(6, 182, 212, 0.4) 0%, transparent 60%)',
        'gradient-blob-cyan': 'radial-gradient(circle at 80% 30%, rgba(6, 182, 212, 0.5) 0%, transparent 50%)',
      },
    },
  },
  plugins: [],
}
