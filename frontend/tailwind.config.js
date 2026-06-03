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
        school: {
          blue: '#0A4D8C',
          green: '#138D75',
          maroon: '#7B1E3A',
          white: '#FFFFFF',
          bgLight: '#F8FAFC',
          blueDark: '#073a6b',
          blueLight: '#e6f0fa',
          greenDark: '#0e6f5c',
          greenLight: '#e8f7f4',
          maroonDark: '#5e172c',
          maroonLight: '#fcf0f2',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'Manrope', 'sans-serif'],
        jakarta: ['"Plus Jakarta Sans"', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        manrope: ['Manrope', 'sans-serif'],
      },
      boxShadow: {
        premium: '0 4px 30px rgba(0, 0, 0, 0.03)',
        glass: '0 8px 32px 0 rgba(10, 77, 140, 0.08)',
        card: '0 10px 30px -10px rgba(10, 77, 140, 0.08)',
        cardHover: '0 20px 40px -15px rgba(10, 77, 140, 0.15)',
      },
      backdropBlur: {
        premium: '8px',
      }
    },
  },
  plugins: [],
}

