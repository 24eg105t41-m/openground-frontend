/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50:  '#f0f7f0',
          100: '#dceedc',
          200: '#bcdcbc',
          300: '#8ec28e',
          400: '#5ea35e',
          500: '#3d843d',
          600: '#2d6a2d',
          700: '#245424',
          800: '#1e421e',
          900: '#193719',
          950: '#0c1f0c',
        },
        cream: {
          50:  '#fdfcf8',
          100: '#faf7ef',
          200: '#f4edda',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
