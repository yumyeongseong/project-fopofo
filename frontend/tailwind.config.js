/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Pretendard'", "'Noto Sans KR'", "sans-serif"],
        serif: ["'Noto Serif KR'", "serif"],
        mono: ["'Fira Mono'", "monospace"],
      },
      colors: {
        brown: {
          400: '#A9714B',
          700: '#6B3E26',
        },
      },
      keyframes: {
        fadeFloat: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        'fade-float': 'fadeFloat 1.5s ease-out forwards',
        'float-slow': 'float 3.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

