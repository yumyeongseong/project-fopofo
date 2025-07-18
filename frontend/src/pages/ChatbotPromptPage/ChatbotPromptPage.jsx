// src/components/ChatbotSection/ChatbotSection.jsx

import React, { useState, useEffect, useRef } from "react"; // ✅ useEffect, useRef 추가
import {
  BadgeCheck, FolderKanban, UsersRound, TrendingUp, Send, BrainCircuit
} from "lucide-react";
import TypingIntro from '../../components/TypingIntro';
import TypingAnswer from '../../components/TypingAnswer';
import { pythonApi } from '../../services/api'; // ✅ api.js의 pythonApi 인스턴스 사용


export default function ChatbotSection() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showButtons, setShowButtons] = useState(true);
  const [presetQuestions, setPresetQuestions] = useState([]); // ✅ 버튼 질문 목록을 담을 상태

  // ✅ 컴포넌트가 처음 로딩될 때, 저장된 질문 목록을 백엔드에서 불러옵니다.
  useEffect(() => {
    const fetchPresetQuestions = async () => {
      try {
        // 백엔드의 get-answers API 호출 (api.js가 자동으로 토큰을 넣어줍니다)
        const response = await pythonApi.get('/api/chatbot/get-answers');
        setPresetQuestions(response.data); // 받아온 질문 목록을 state에 저장
      } catch (error) {
        console.error("사전 질문 로딩 실패:", error);
      }
    };
    fetchPresetQuestions();
  }, []); // []를 비워두면 처음 한 번만 실행됩니다.


  // ✅ handleSend 함수를 pythonApi를 사용하도록 수정합니다.
  const handleSend = async (q) => {
    const userInput = q || question.trim();
    if (!userInput) return;

    setIsLoading(true);
    setShowButtons(false);
    setAnswer("");
    setQuestion(userInput); // 사용자가 버튼을 눌렀을 때도 질문이 보이도록 설정

    try {
      // pythonApi를 사용해 백엔드의 /chat 엔드포인트로 요청
      const response = await pythonApi.post(
        '/api/chatbot/chat', 
        { query: userInput } // 백엔드 ChatRequest 모델 형식에 맞춤
      );
      setAnswer(response.data.response);

    } catch (error) {
      console.error("챗봇 응답 요청 실패:", error.response?.data || error.message);
      setAnswer("죄송합니다. 답변을 가져오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
      setShowButtons(true);
      setQuestion(""); // 답변 후 입력창 비우기
    }
  };

  // --- 이 아래의 JSX 반환 부분은 UI 구조를 유지합니다. ---
  return (
    <div className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-md rounded-2xl px-8 pt-8 pb-12 shadow-2xl text-center space-y-6 font-sans text-[15px] tracking-tight">
      <h2 className="text-2xl font-bold text-black tracking-wide">나만의 챗봇</h2>

      <TypingIntro
        fullText={`안녕하세요! 챗봇에 오신 걸 환영합니다.\n궁금한 점을 선택하거나 아래에 입력해 주세요!`}
      />

      {/* ✅ presetQuestions 상태를 기반으로 버튼들을 동적으로 생성합니다. */}
      {showButtons && presetQuestions.length > 0 && (
        <div className="flex flex-col gap-3 mb-12">
          {presetQuestions.map((q_text, index) => (
            <button
              key={index}
              className="flex items-center gap-2 justify-center w-full bg-pink-300 hover:bg-pink-400 text-white py-3 rounded-full shadow transition font-semibold"
              onClick={() => handleSend(q_text)}
            >
              {/* 아이콘은 예시로 몇 가지만 남겨둡니다. */}
              {index === 0 && <BadgeCheck className="w-5 h-5" />}
              {index === 1 && <FolderKanban className="w-5 h-5" />}
              {index === 2 && <UsersRound className="w-5 h-5" />}
              {index === 3 && <TrendingUp className="w-5 h-5" />}
              {q_text}
            </button>
          ))}
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