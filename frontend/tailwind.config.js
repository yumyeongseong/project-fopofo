/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html", // 이 부분도 포함하는 것이 좋습니다.
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Pretendard'", "'Noto Sans KR'", "sans-serif"],
        serif: ["'Noto Serif KR'", "serif"],
        mono: ["'Fira Mono'", "monospace"],
      },
    },
  },
  plugins: [],
}