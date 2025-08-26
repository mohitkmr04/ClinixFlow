import colors from 'tailwindcss/colors'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      gridTemplateColumns: {
        'auto': 'repeat(auto-fill, minmax(200px, 1fr))'
      },
      colors: {
        primary: {
          DEFAULT: colors.cyan[500],   // now `bg-primary` → cyan-500
          ...colors.cyan               // and you still get primary-50…primary-900
        }
      }
    },
  },
  plugins: [],
}
