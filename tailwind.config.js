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
        command: {
          950: '#070B13',
          900: '#0C1322',
          850: '#111B30',
          800: '#172440',
          700: '#1E3259',
          600: '#2A467C',
          500: '#3B82F6',
          400: '#60A5FA',
        },
        risk: {
          low: '#10B981',      // Emerald
          medium: '#F59E0B',   // Amber
          high: '#F97316',     // Orange
          critical: '#EF4444', // Red
        },
        tactical: {
          border: 'rgba(255, 255, 255, 0.1)',
          glass: 'rgba(12, 19, 34, 0.85)',
          hover: 'rgba(255, 255, 255, 0.05)',
          accent: '#06B6D4',   // Cyan
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.75', transform: 'scale(1.05)' },
        },
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar': 'radarSweep 4s linear infinite',
      }
    },
  },
  plugins: [],
}
