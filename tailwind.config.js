/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Gunakan class agar lebih fleksibel
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#F3F1EB',
        lineaPurple: '#0A0057',
        lineaYellow: '#FFF35B',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
}
