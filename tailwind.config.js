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
        dev: {
          bg: '#0F0F1A',
          surface: '#1A1A2E',
          card: '#22223B',
          border: '#2E2E4D',
          primary: '#6C3BFF',
          accent: '#F59E0B',
          text: {
            main: '#E5E7EB',
            muted: '#9CA3AF'
          }
        }
      }
    },
  },
  plugins: [],
}
