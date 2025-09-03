/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0C1C3A',
          900: '#0B1530',
          700: '#162748',
        },
        ink: '#0E1320',
        gold: {
          DEFAULT: '#C8A862',
          soft: '#D9C79A',
        },
        mist: '#E9EEF5',
        stone: '#93A4BE',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'tight-plus': '-0.04em',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      backgroundImage: {
        'gradient-overlay': 'linear-gradient(to bottom, rgba(11, 21, 48, 0.8), rgba(12, 28, 58, 0.95))',
      },
    },
  },
  plugins: [],
}
