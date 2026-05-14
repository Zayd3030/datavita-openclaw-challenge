/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dv-green': '#00c896',
        'dv-bg': '#0a0e1a',
        'dv-surface': '#111827',
        'dv-text': '#e2e8f0',
      },
      fontFamily: {
        mono: ['"DM Mono"', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
