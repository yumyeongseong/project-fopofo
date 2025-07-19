import React, { useState } from 'react';
import { pythonApi } from "../services/api"; // ✅ api.js에서 pythonApi 가져오기
import TypingAnswer from './TypingAnswer'; // 타이핑 효과 컴포넌트

// 👇 [수정] function ChatbotSection() { ... } 으로 전체를 감싸줍니다.
function ChatbotSection() {
  // 👇 [추가] 챗봇에 필요한 상태들을 정의합니다.
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showButtons, setShowButtons] = useState(true);

  const predefinedQuestions = [
    "자신의 강점이 잘 드러난 경험 하나를 소개해주세요.",
    "가장 자신 있는 프로젝트 혹은 작업 경험은 무엇인가요?",
    "협업 중, 기억에 남은 순간이나 갈등 해결 사례가 있나요?",
  ];

  // 👇 이전에 개선 제안했던 handleSend 함수를 컴포넌트 안으로 이동시킵니다.
  const handleSend = async (q) => {
    const userInput = q || question.trim();
    if (!userInput || isLoading) return;

    setIsLoading(true);
    setShowButtons(false);
    setAnswer(""); // 답변 초기화

    try {
      const response = await pythonApi.post('/chat', { query: userInput });
      setAnswer(response.data.response);
    } catch (error) {
      console.error("챗봇 응답 요청 실패:", error.response?.data || error.message);
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

  // 👇 [추가] 사용자에게 보여줄 JSX 화면을 반환합니다.
  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md border mt-10">
      <h2 className="text-xl font-semibold mb-4">🤖 나만의 챗봇</h2>

      {/* 답변 영역 */}
      {isLoading && <p>답변을 생성 중입니다...</p>}
      {answer && <TypingAnswer fullText={answer} />}

      {/* 추천 질문 버튼 */}
      {showButtons && (
        <div className="flex flex-wrap gap-2 mb-4">
          {predefinedQuestions.map((q, i) => (
            <button key={i} onClick={() => handleSend(q)} className="bg-gray-200 px-3 py-1 rounded-full text-sm">
              {q}
            </button>
          ))}
        </div>
      )}

      {/* 질문 입력 영역 */}
      <div className="flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="질문을 입력하세요..."
          className="flex-1 p-2 border rounded"
          disabled={isLoading}
        />
        <button onClick={() => handleSend()} disabled={isLoading} className="bg-blue-500 text-white px-4 py-2 rounded">
          전송
        </button>
      </div>
    </div>
  );
}

export default ChatbotSection;