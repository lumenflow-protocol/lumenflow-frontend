/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#8B5CF6',
          dark: '#7C3AED',
          light: '#EDE9FE',
        },
        accent: {
          DEFAULT: '#06B6D4',
          dark: '#0891B2',
        },
        surface: {
          DEFAULT: '#0f1117',
          raised: '#13151f',
          overlay: '#1a1d2e',
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
        'gradient-card': 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(6,182,212,0.05))',
      },
      fontFamily: {
        sans: [
          '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto',
          'Oxygen', 'Ubuntu', 'sans-serif',
        ],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
