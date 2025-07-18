/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
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
    },
  },
  plugins: [],
};