/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f4f1ff',
          100: '#e9e4fe',
          200: '#d5ccfd',
          300: '#bba6fb',
          400: '#9d8cd4', // Primary lilac
          500: '#8a7ac0',
          600: '#6b5ca5',
          700: '#5a4d8a',
          800: '#4a4071',
          900: '#3f375d',
        },
        teal: {
          50: '#effcfc',
          100: '#d7f5f5',
          200: '#b5ecea',
          300: '#84dfdd',
          400: '#5dbfbb', // Secondary teal
          500: '#3aa5a1',
          600: '#2f8885',
          700: '#2a6d6c',
          800: '#265857',
          900: '#234a49',
        },
        blue: {
          50: '#f0f7ff',
          100: '#e0eefe',
          200: '#b9ddfd',
          300: '#7cc2fc',
          400: '#6695e2', // Accent blue
          500: '#3f7ddb',
          600: '#2e64cd',
          700: '#274fa6',
          800: '#254488',
          900: '#213a71',
        },
        appDark: '#1a202c', // Adding the appDark color
      }
    },
  },
  plugins: [],
}

