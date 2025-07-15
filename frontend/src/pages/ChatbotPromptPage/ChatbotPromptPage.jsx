import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChatbotPromptPage.css';

const ChatbotPromptPage = () => {
  const [answers, setAnswers] = useState(Array(4).fill(''));
  const navigate = useNavigate();

  const handleChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    console.log('프롬프트 응답:', answers);
  };

  const questions = [
    '자신의 강점이 잘 드러난 경험 하나를 소개해주세요.',
    '가장 자신 있는 프로젝트 또는 작업 경험은 무엇인가요?',
    '협업 중 기억에 남는 순간이나 갈등 해결 사례가 있다면요?',
    '가장 힘들었지만 성장했다고 느낀 순간은 언제였나요?',
  ];

  return (
    <div className="prompt-wrapper">
      {/* ✅ 로고 */}
      <img
        src="/images/logo.png"
        alt="포포포 로고"
        className="logo"
        onClick={() => navigate('/')}
      />

      {/* ✅ my page */}
      <div
        className="mypage"
        onClick={() => navigate('/mypage')}
      >
        my page
      </div>

      {/* ✅ 본문 */}
      <div className="prompt-container">
        <h1>Q / A For Chatbot</h1>
        <div className="qa-form">
          {questions.map((q, i) => (
            <div key={i} className="qa-block">
              <p className="question">Q. {q}</p>
              <textarea
                className="answer-input"
                value={answers[i]}
                onChange={(e) => handleChange(i, e.target.value)}
              />
            </div>
          ))}
        </div>
        <button className="create-button" onClick={handleSubmit}>
          create
        </button>
      </div>
    </div>
  );
};

export default ChatbotPromptPage;
