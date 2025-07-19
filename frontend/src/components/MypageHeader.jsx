import { useNavigate } from "react-router-dom";

export default function MypageHeader() {
  const navigate = useNavigate();

  return (
    <header className="flex justify-between items-center px-6 py-4">
      <img
        src="/Fopofo-Logo.png"
        alt="FoPoFo Logo"
        className="w-28 h-auto cursor-pointer"
        onClick={() => navigate("/home")} // ✅ 홈페이지로
      />

      <button
        onClick={() => navigate("/mypage")} // ✅ 마이페이지 시작화면
        className="border-2 border-pink-300 px-6 py-1 rounded-xl font-serif text-lg tracking-widest text-gray-700 shadow hover:bg-pink-100 transition"
      >
        my page
      </button>

      <button
        onClick={() => navigate("/")} // ✅ 로그아웃
        className="text-sm text-gray-600 underline hover:text-gray-800"
      >
        로그아웃
      </button>
    </header>
  );
}
