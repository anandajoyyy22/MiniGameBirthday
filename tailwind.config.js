/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          50: '#fef2f4',
          100: '#fde5e9',
          200: '#fbcad3',
          300: '#f79fb0',
          400: '#f06684',
          500: '#e3365f',
          600: '#cb1a48',
          700: '#b81436',
          800: '#990024',
          900: '#80001f',
          950: '#4d0010',
        },
        champagne: {
          50: '#faf7ed',
          100: '#f4ebd2',
          200: '#ebd8a5',
          300: '#dfbf72',
          400: '#d4a544',
          500: '#c28f2f',
          600: '#a67224',
          700: '#845320',
          800: '#6d431f',
          900: '#5c391d',
        },
        brand: {
          maroon: '#990024',
          maroonBright: '#B81436',
          maroonDark: '#80001F',
          maroonDeep: '#4D0010',
          gold: '#D4AF37',
          goldLight: '#F3C766',
          cream: '#FFFBFB',
          pearl: '#FFFFFF',
          roseSoft: '#FDE5E9',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Outfit', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'float-delayed': 'float 4s ease-in-out 2s infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
        'bounce-soft': 'bounceSoft 2s infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-15px) rotate(2deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0.2', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      }
    },
  },
  plugins: [],
}
