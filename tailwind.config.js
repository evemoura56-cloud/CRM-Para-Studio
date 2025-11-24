/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0C0C0D',
        'neon-red': '#FF0000',
        'petrol-blue': '#0A3D62',
        'ice-gray': '#E6E6E6',
        'charcoal-gray': '#343434',
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
      },
      boxShadow: {
        'neon-red': '0 0 10px #FF0000',
        'neon-red-strong': '0 0 18px #FF0000',
        'neon-red-intense': '0 0 25px #FF0000, 0 0 50px #FF0000',
      },
      animation: {
        'neon-blink': 'neonBlink 2s infinite',
        'pulse-neon': 'pulseNeon 3s ease-in-out infinite',
      },
      keyframes: {
        neonBlink: {
          '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': {
            textShadow: '0 0 10px #FF0000, 0 0 20px #FF0000, 0 0 30px #FF0000, 0 0 40px #FF0000',
            opacity: '1',
          },
          '20%, 24%, 55%': {
            textShadow: 'none',
            opacity: '0.4',
          },
        },
        pulseNeon: {
          '0%, 100%': {
            filter: 'drop-shadow(0 0 5px #FF0000) drop-shadow(0 0 10px #FF0000)',
          },
          '50%': {
            filter: 'drop-shadow(0 0 10px #FF0000) drop-shadow(0 0 20px #FF0000) drop-shadow(0 0 30px #FF0000)',
          },
        },
      },
    },
  },
  plugins: [],
}
