/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#FF85A1',
        'secondary': '#640D14',
        'background': '#FFF5F5',
        'accent': '#D4AF37',
      },
      fontFamily: {
        'display': ['"Playfair Display"', 'serif'],
        'body': ['"Inter"', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '1.5rem',
      },
      boxShadow: {
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      }
    },
  },
  plugins: [],
}