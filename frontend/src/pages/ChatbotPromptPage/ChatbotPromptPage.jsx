import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChatbotPromptPage.css';

function ChatbotPromptPage() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState(['', '', '', '']);

  // ✅ Enter 키로 다음 페이지 이동
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [answers]);

  const handleChange = (index, value) => {
    setAnswers(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleNext = () => {
    if (answers.some(ans => ans.trim() === '')) {
      alert('모든 질문에 답변해주세요.');
      return;
    }
    // ✅ 이후 백엔드 연동 예상
    navigate('/portfolio-created');
  };

  const questions = [
    '자신의 강점이 잘 드러난 경험 하나를 소개해주세요.',
    '가장 자신 있는 프로젝트 또는 작업 경험은 무엇인가요?',
    '협업 중 기억에 남는 순간이나 갈등 해결 사례가 있다면요?',
    '가장 힘들었지만 성장했다고 느낀 순간은 언제였나요?'
  ];

  return (
    <div className="homepage-container">
      {/* 좌측 상단 로고 */}
      <img
        src="/images/fopofo-logo.png"
        alt="logo"
        className="nav-logo"
        onClick={() => navigate('/')}
      />

      {/* 우측 상단 버튼 */}
      <div className="noportfolio-top-buttons">
        <button className="outline-btn" onClick={() => navigate('/')}>logout</button>
        <button className="outline-btn" onClick={() => navigate('/home')}>Exit</button>
      </div>

      {/* 타이틀 */}
      <div className="chatbot-prompt-container">
        <h1 className="chatbot-prompt-title animate-3d">
          Build your chatbot<br />with your stories
        </h1>

        <p className="chatbot-prompt-subtitle animate-3d">
          이력서에 담지 못한 당신의 이야기와 경험을 자유롭게 적어주세요!<br />
          (이 프롬프트는 챗봇이 면접관의 질문에 답변하는 데 활용됩니다.)
        </p>

        {/* 질문 카드 */}
        <div className="prompt-card animate-3d">
          {questions.map((q, i) => (
            <div key={i} className="prompt-box">
              <label>Q. {q}</label>
              <textarea
                placeholder="A."
                value={answers[i]}
                onChange={(e) => handleChange(i, e.target.value)}
              />
            </div>
          ))}

          <button className="chatbot-next-btn" onClick={handleNext}>Next</button>
        </div>
      </div>
    </div>
  );
}

export default ChatbotPromptPage;
