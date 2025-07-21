// src/pages/ChatbotPromptPage/ChatbotPromptPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChatbotPromptPage.css';
import { pythonApi } from '../../services/api';

const ChatbotPromptPage = () => {
  const [answers, setAnswers] = useState(Array(4).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const questions = [
    '자신의 강점이 잘 드러난 경험 하나를 소개해주세요.',
    '가장 자신 있는 프로젝트 또는 작업 경험은 무엇인가요?',
    '협업 중 기억에 남는 순간이나 갈등 해결 사례가 있다면요?',
    '가장 힘들었지만 성장했다고 느낀 순간은 언제였나요?',
  ];

  const handleChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    const allAnswered = answers.every(answer => answer.trim() !== '');
    if (!allAnswered) {
      alert('모든 질문에 답변해주세요!');
      return;
    }

    setIsLoading(true);

    try {
      // ✅ MongoDB 저장용 배열 생성
      const answersDataList = questions.map((q, i) => ({
        question: q,
        answer: answers[i]
      }));

      // ✅ 1. 답변 저장
      await pythonApi.post('/save-answers', {
        answers: answersDataList
      });

      console.log('질문 답변 MongoDB 저장 완료');

      // ✅ 2. URL 생성
      const generateUrlResponse = await pythonApi.post('/generate-portfolio-url', {});
      const portfolioUrl = generateUrlResponse.data.portfolio_url;
      console.log('생성된 포트폴리오 URL:', portfolioUrl);

      alert('포트폴리오가 성공적으로 생성되었습니다!');
      navigate('/portfolio-created', { state: { portfolioUrl } });

    } catch (error) {
      if (error.response?.status === 401) {
        alert('인증 정보가 유효하지 않습니다. 다시 로그인해주세요.');
        navigate('/login');
      } else {
        console.error('API 호출 실패:', error.response?.data || error.message);
        alert('데이터 저장 및 URL 생성에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="prompt-wrapper">
      <header className="prompt-header">
        <img
          src="/images/fopofo-logo.png"
          alt="포포포 로고"
          className="prompt-logo"
          onClick={() => navigate('/mainpage')}
        />
        <button className="prompt-mypage-button" onClick={() => navigate('/mypage')}>
          my page
        </button>
      </header>

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

        <button className="create-button" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? '생성 중...' : 'create'}
        </button>
      </div>
    </div>
  );
};

export default ChatbotPromptPage;
