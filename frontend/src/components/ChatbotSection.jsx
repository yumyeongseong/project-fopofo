import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { pythonApi } from "../services/api";
import {
  BadgeCheck,
  FolderKanban,
  UsersRound,
  TrendingUp,
  Send,
} from "lucide-react";
import TypingIntro from "./TypingIntro";
import TypingAnswer from "./TypingAnswer";

// ✅ 외부에서 publicUserId를 받을 수 있도록 props에 추가합니다.
export default function ChatbotSection({ publicUserId }) {
  const { user } = useAuth(); // 로그인한 사용자 정보

  // ✅ 챗봇의 주인을 결정합니다.
  // 공개 페이지라면 publicUserId를, 아니라면 로그인된 사용자의 ID를 사용합니다.
  const chatbotOwnerId = publicUserId || user?.userId;

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showButtons, setShowButtons] = useState(true);
  const [predefinedQuestions, setPredefinedQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await pythonApi.get('/predefined-questions');
        setPredefinedQuestions(response.data.questions);
      } catch (error) {
        console.error("사전 정의된 질문 로딩 실패:", error);
      }
    };
    fetchQuestions();
  }, []);

  const handleSend = async (q) => {
    const userInput = q || question.trim();
    if (!userInput) return;

    setIsLoading(true);
    setShowButtons(false);
    setAnswer("");

    try {
      // ✅ API 요청 시, 어떤 사용자의 챗봇과 대화할지 userId를 함께 보냅니다.
      const response = await pythonApi.post(
        '/chat',
        {
          query: userInput,
          user_id: chatbotOwnerId // 이 userId를 기준으로 Pinecone 네임스페이스를 찾습니다.
        }
      );
      setAnswer(response.data.response);
    } catch (error) {
      console.error("챗봇 응답 요청 실패:", error.response?.data || error.message);
      setAnswer("죄송합니다. 답변을 가져오는 중 오류가 발생했습니다.");
    } finally {
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
        fullText={`안녕하세요 챗봇에 오신 걸 환영합니다.\n궁금한 점을 선택하거나 아래에 입력해 주세요!`}
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
          placeholder="궁금한 점을 입력해주세요!"
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