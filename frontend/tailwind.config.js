/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Pretendard'", "'Noto Sans KR'", "sans-serif"],
        serif: ["'Noto Serif KR'", "serif"],
        mono: ["'Fira Mono'", "monospace"],
      },
      // 👇 [병합] 팀원이 추가한 커스텀 색상(brown)을 반영합니다.
      colors: {
        brown: {
          400: '#A9714B',
          700: '#6B3E26',
        },
      },
    },
  },
  plugins: [],
}