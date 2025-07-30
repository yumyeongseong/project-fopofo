import { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { pythonApi } from "../services/api";
import {
  BadgeCheck,
  FolderKanban,
  UsersRound,
  TrendingUp,
  Send,
  ArrowUpCircle,
  Bot,
  MessageSquare,
  Loader2,
} from "lucide-react";
import TypingIntro from "./TypingIntro";
import TypingAnswer from "./TypingAnswer";

export default function ChatbotSection({ publicUserId }) {
  const { user } = useAuth();
  const chatbotOwnerId = publicUserId || user?.userId;

  const [question, setQuestion] = useState("");
  const [chatList, setChatList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatWrapperRef = useRef(null);
  const inputRef = useRef(null);

  const handleSend = async (q) => {
    const userInput = q || question.trim();

    if (!userInput || isLoading || !chatbotOwnerId) return;

    setIsLoading(true);
    setIsTyping(true);
    setQuestion("");
    setChatList((prev) => [...prev, { role: "user", text: userInput }]);

    try {
      const response = await pythonApi.post('/chat', {
        query: userInput,
        userId: chatbotOwnerId
      });
      const responseText = response.data?.response || "답변을 받아오지 못했습니다.";
      setChatList((prev) => [...prev, { role: "bot", text: responseText }]);
    } catch (error) {
      const errorMsg = error.response?.data?.detail || "서버 오류가 발생했습니다.";
      setChatList((prev) => [...prev, { role: "bot", text: errorMsg }]);
    }
  };

  useEffect(() => {
    if (chatWrapperRef.current) {
      chatWrapperRef.current.scrollTo({
        top: chatWrapperRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatList, isTyping]);

  return (
    <div className="w-full max-w-2xl mx-auto bg-white/90 backdrop-blur-md rounded-2xl shadow-xl font-sans mt-12 overflow-hidden flex flex-col">
      <div
        ref={chatWrapperRef}
        className="flex-grow max-h-[600px] overflow-y-auto px-6 sm:px-8 pt-10 pb-6 space-y-6 scroll-smooth"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">나만의 챗봇</h2>
        <TypingIntro fullText={`안녕하세요, 지원자의 챗봇입니다.\n궁금한 점을 선택하거나 아래에 직접 입력해 주세요!`} />

        <div className="flex flex-col gap-3">
          <button onClick={() => handleSend("자신의 강점이 잘 드러난 경험 하나를 소개해주세요.")} className="flex items-center gap-2 justify-center w-full bg-pink-300 hover:bg-pink-400 text-white py-3 rounded-xl font-semibold shadow transition">
            <BadgeCheck className="w-5 h-5" /> 강점이 드러난 경험
          </button>
          <button onClick={() => handleSend("가장 자신 있는 프로젝트 또는 작업 경험은 무엇인가요?")} className="flex items-center gap-2 justify-center w-full bg-pink-300 hover:bg-pink-400 text-white py-3 rounded-xl font-semibold shadow transition">
            <FolderKanban className="w-5 h-5" /> 자신 있는 프로젝트
          </button>
          <button onClick={() => handleSend("협업 중 기억에 남는 순간이나 갈등 해결 사례가 있나요?")} className="flex items-center gap-2 justify-center w-full bg-pink-300 hover:bg-pink-400 text-white py-3 rounded-xl font-semibold shadow transition">
            <UsersRound className="w-5 h-5" /> 협업 및 갈등 해결
          </button>
          <button onClick={() => handleSend("가장 힘들었지만 성장했다고 느낀 순간은 언제였나요?")} className="flex items-center gap-2 justify-center w-full bg-pink-300 hover:bg-pink-400 text-white py-3 rounded-xl font-semibold shadow transition">
            <TrendingUp className="w-5 h-5" /> 성장한 순간
          </button>
        </div>

        {chatList.map((chat, idx) => (
          <div key={idx} className="text-left w-full">
            {chat.role === "user" ? (
              <div className="text-sm text-gray-800 font-medium mb-2 bg-gray-100 px-4 py-2 rounded-xl w-fit ml-auto flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-gray-500" />
                {chat.text}
              </div>
            ) : (
              <div className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-pink-500 font-semibold flex-shrink-0 flex items-center gap-1 mt-1">
                  <Bot className="w-4 h-4" /> 챗봇
                </span>
                <TypingAnswer
                  fullText={chat.text}
                  onFinish={() => {
                    setIsTyping(false);
                    setIsLoading(false);
                    inputRef.current?.focus();
                  }}
                />
              </div>
            )}
          </div>
        ))}

        {isLoading && !isTyping && (
          <div className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-xl w-fit flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
            답변을 생성 중입니다...
          </div>
        )}
      </div>

      {chatList.filter((c) => c.role === "user").length > 0 && (
        <div className="flex justify-center items-center gap-2 py-2 border-t">
          <button
            className="text-pink-400 hover:text-pink-600 text-sm flex items-center gap-1"
            onClick={() => {
              chatWrapperRef.current?.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <ArrowUpCircle className="w-5 h-5" /> 핵심 질문으로 돌아가기
          </button>
        </div>
      )}

      <div className="flex items-center border-t px-6 py-4 bg-white">
        <input
          ref={inputRef}
          type="text"
          placeholder="지원자에 대해 궁금한 점을 입력해주세요!"
          className="flex-grow bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 caret-gray-700"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={isLoading}
        />
        <button
          className="text-blue-500 hover:text-blue-700 disabled:opacity-30"
          onClick={() => handleSend()}
          disabled={isLoading}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}