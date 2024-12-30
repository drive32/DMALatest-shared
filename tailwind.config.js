/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: '#000000',
        secondary: '#FFFFFF',
        accent: {
          50: '#e1e7f4',
          100: '#c3cfe9',
          200: '#a6b8dd',
          300: '#89a1d1',
          400: '#6e8ac4',
          500: '#5373b7',
          600: '#395caa',
          700: '#20449d',
          800: '#072a8e',
          900: '#000080',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};