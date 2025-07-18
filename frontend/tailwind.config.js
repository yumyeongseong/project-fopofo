/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html", // 이 부분도 포함하는 것이 좋습니다.
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}