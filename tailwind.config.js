/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kype: {
          bg: '#0e0e10',
          sidebar: '#0b0b0d',
          surface: '#151517',
          surface2: '#1b1b1e',
          surface3: '#26262a',
          border: '#212124',
          borderStrong: '#2d2d32',
          text: '#ededef',
          text2: '#a1a1aa',
          muted: '#71717a',
          accent: '#6e6af6',
          ok: '#4ade80',
          warn: '#fbbf24',
          danger: '#f87171',
        }
      },
      borderRadius: {
        'kype': '14px',
      },
      boxShadow: {
        'pop': '0 16px 40px rgba(0, 0, 0, .55), 0 0 0 1px rgba(255, 255, 255, .04)',
      }
    },
  },
  plugins: [],
}