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
import axios from 'axios'; // 1. axios 라이브러리를 가져옵니다.

export default function ChatbotSection() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showButtons, setShowButtons] = useState(true);

  // 2. handleSend 함수를 실제 API를 호출하도록 수정합니다.
  const handleSend = async (q) => {
    const userInput = q || question.trim();
    if (!userInput) return;

    setIsLoading(true);
    setShowButtons(false);
    setAnswer("");

    try {
      // 로컬 스토리지에서 JWT 토큰을 가져옵니다.
      const token = localStorage.getItem('token');
      if (!token) {
        alert('인증 정보가 없습니다. 다시 로그인해주세요.');
        setIsLoading(false);
        setShowButtons(true);
        // navigate('/login'); // 필요하다면 로그인 페이지로 이동시킬 수 있습니다.
        return;
      }

      // Python 서버의 /chat 엔드포인트로 요청을 보냅니다.
      const response = await axios.post(
        'http://localhost:8000/chat', // Python 서버 주소
        { query: userInput }, // 백엔드의 ChatRequest 모델 형식에 맞춤
        {
          headers: {
            'Authorization': `Bearer ${token}` // 헤더에 JWT 인증 토큰 추가
          }
        }
      );

      // API 응답으로 받은 챗봇의 답변을 state에 저장합니다.
      setAnswer(response.data.response);

    } catch (error) {
      console.error("챗봇 응답 요청 실패:", error.response?.data || error.message);
      setAnswer("죄송합니다. 답변을 가져오는 중 오류가 발생했습니다.");
    } finally {
      // 로딩 상태를 해제하고 버튼을 다시 표시합니다.
      setIsLoading(false);
      setShowButtons(true);
      setQuestion("");
    }
  };

  // --- 이 아래의 JSX 반환 부분은 기존과 동일합니다. ---
  return (
    <div className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-md rounded-2xl px-8 pt-8 pb-12 shadow-2xl text-center space-y-6 font-sans text-[15px] tracking-tight">
      <h2 className="text-2xl font-bold text-black tracking-wide">나만의 챗봇</h2>

      <TypingIntro
        fullText={`안녕하세요 홍길동 챗봇에 오신 걸 환영합니다.\n궁금한 점을 선택하거나 아래에 입력해 주세요!`}
      />

      {showButtons && (
        <div className="flex flex-col gap-3 mb-12">
          <button
            className="flex items-center gap-2 justify-center w-full bg-pink-300 hover:bg-pink-400 text-white py-3 rounded-full shadow transition font-semibold"
            onClick={() => handleSend("강점이 드러난 경험")}
          >
            <BadgeCheck className="w-5 h-5" />
            강점이 드러난 경험
          </button>

          <button
            className="flex items-center gap-2 justify-center w-full bg-pink-300 hover:bg-pink-400 text-white py-3 rounded-full shadow transition font-semibold"
            onClick={() => handleSend("자신 있는 프로젝트")}
          >
            <FolderKanban className="w-5 h-5" />
            자신 있는 프로젝트
          </button>

          <button
            className="flex items-center gap-2 justify-center w-full bg-pink-300 hover:bg-pink-400 text-white py-3 rounded-full shadow transition font-semibold"
            onClick={() => handleSend("협업 갈등 해결 사례")}
          >
            <UsersRound className="w-5 h-5" />
            협업 갈등 해결 사례
          </button>

          <button
            className="flex items-center gap-2 justify-center w-full bg-pink-300 hover:bg-pink-400 text-white py-3 rounded-full shadow transition font-semibold"
            onClick={() => handleSend("가장 성장한 순간")}
          >
            <TrendingUp className="w-5 h-5" />
            가장 성장한 순간
          </button>
        </div>
      )}

      {answer && <TypingAnswer fullText={answer} />}

      <div className="flex items-center border rounded-full px-4 py-2 shadow-inner bg-white">
        <input
          type="text"
          placeholder="‘홍길동’에게 궁금한 점을 입력해주세요!"
          className="flex-grow bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
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