import { useState } from "react";
import {
  BadgeCheck,
  FolderKanban,
  UsersRound,
  TrendingUp,
  Send,
} from "lucide-react";
import TypingIntro from "./TypingIntro";
import TypingAnswer from "./TypingAnswer";
import { pythonApi } from "../services/api";

export default function ChatbotSection() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showButtons, setShowButtons] = useState(true);

  const handleSend = async (q) => {
    const userInput = q || question.trim();
    if (!userInput || isLoading) return;

    setIsLoading(true);
    setShowButtons(false);
    setAnswer("");

    try {
      // ✅ JWT 토큰이 있다면 인증 포함
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await pythonApi.post(
        "/chat",
        { query: userInput },
        { headers }
      );

      setAnswer(response.data.response);
    } catch (error) {
      console.error("챗봇 응답 오류:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        setAnswer("인증 정보가 유효하지 않습니다. 다시 로그인해주세요.");
      } else {
        setAnswer("죄송합니다. 답변을 가져오는 중 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
      setShowButtons(true);
      setQuestion("");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-md rounded-2xl px-8 pt-8 pb-12 shadow-2xl text-center space-y-6 font-sans text-[15px] tracking-tight">
      <h2 className="text-2xl font-bold text-black tracking-wide">나만의 챗봇</h2>

      <TypingIntro
        fullText={`안녕하세요 홍길동 챗봇에 오신 걸 환영합니다.\n궁금한 점을 선택하거나 아래에 입력해 주세요!`}
      />

      {showButtons && (
        <div className="flex flex-col gap-3 mb-10">
          <button
            className="flex items-center gap-2 justify-center w-full bg-pink-300 hover:bg-pink-400 text-white py-3 rounded-full shadow transition font-semibold"
            onClick={() => handleSend("자신의 강점이 잘 드러난 경험 하나를 소개해주세요.")}
          >
            <BadgeCheck className="w-5 h-5" />
            강점이 드러난 경험
          </button>

          <button
            className="flex items-center gap-2 justify-center w-full bg-pink-300 hover:bg-pink-400 text-white py-3 rounded-full shadow transition font-semibold"
            onClick={() => handleSend("가장 자신 있는 프로젝트 또는 작업 경험은 무엇인가요?")}
          >
            <FolderKanban className="w-5 h-5" />
            자신 있는 프로젝트
          </button>

          <button
            className="flex items-center gap-2 justify-center w-full bg-pink-300 hover:bg-pink-400 text-white py-3 rounded-full shadow transition font-semibold"
            onClick={() => handleSend("협업 중 기억에 남는 순간이나 갈등 해결 사례가 있다면요?")}
          >
            <UsersRound className="w-5 h-5" />
            협업 갈등 해결
          </button>

          <button
            className="flex items-center gap-2 justify-center w-full bg-pink-300 hover:bg-pink-400 text-white py-3 rounded-full shadow transition font-semibold"
            onClick={() => handleSend("가장 힘들었지만 성장했다고 느낀 순간은 언제였나요?")}
          >
            <TrendingUp className="w-5 h-5" />
            성장한 순간
          </button>
        </div>
      )}

      {isLoading && <p className="text-gray-500">답변을 생성 중입니다...</p>}
      {answer && <TypingAnswer fullText={answer} />}

      <div className="flex items-center border rounded-full px-4 py-2 shadow-inner bg-white">
        <input
          type="text"
          placeholder="‘홍길동’에게 궁금한 점을 입력해주세요!"
          className="flex-grow bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={isLoading}
        />
        <button
          className="text-blue-500 hover:text-blue-700 disabled:opacity-30"
          disabled={isLoading}
          onClick={() => handleSend()}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
