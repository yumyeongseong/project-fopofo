// src/pages/ChatbotPromptPage/ChatbotPromptPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChatbotPromptPage.css';
// 👇 1. 기존 axios 대신 새로 만든 pythonApi를 가져옵니다.
import { pythonApi } from '../../services/api';

const ChatbotPromptPage = () => {
  const [answers, setAnswers] = useState(Array(4).fill(''));
  const navigate = useNavigate();

  const handleChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  // 👇 2. handleSubmit 함수 내부의 API 호출을 수정합니다.
  const handleSubmit = async () => {
    const allAnswered = answers.every(answer => answer.trim() !== '');
    if (!allAnswered) {
      alert('모든 질문에 답변해주세요!');
      return;
    }

    try {
      // 이제 api.js에서 토큰을 자동으로 확인하고 넣어주므로, 
      // 이 컴포넌트에서 토큰을 직접 가져오고 확인하는 로직은 삭제해도 됩니다.

      const questions = [
        '자신의 강점이 잘 드러난 경험 하나를 소개해주세요.',
        '가장 자신 있는 프로젝트 또는 작업 경험은 무엇인가요?',
        '협업 중 기억에 남는 순간이나 갈등 해결 사례가 있다면요?',
        '가장 힘들었지만 성장했다고 느낀 순간은 언제였나요?',
      ];
      const answersData = {};
      questions.forEach((q, i) => {
        answersData[`question_${i + 1}`] = q;
        answersData[`answer_${i + 1}`] = answers[i];
      });

      // 1. 질문 답변 저장 API 호출 (pythonApi 사용)
      const saveAnswersResponse = await pythonApi.post('/save-answers', {
        answers: answersData
        // 헤더는 이제 자동으로 추가됩니다.
      });

      console.log('질문 답변 MongoDB 저장 완료:', saveAnswersResponse.data);
      alert('질문 답변이 성공적으로 저장되었습니다!');

      // 2. 포트폴리오 URL 생성 API 호출 (pythonApi 사용)
      const generateUrlResponse = await pythonApi.post('/generate-portfolio-url', {}); // body는 비워둠

      const portfolioUrl = generateUrlResponse.data.portfolio_url;
      console.log('생성된 포트폴리오 URL:', portfolioUrl);

      // 3. PortfolioCreatedPage로 URL을 state로 전달하며 이동
      navigate('/portfolio-created', { state: { portfolioUrl: portfolioUrl } });

    } catch (error) {
      if (error.response?.status === 401) {
        alert('인증 정보가 유효하지 않습니다. 다시 로그인해주세요.');
        navigate('/login');
      } else {
        console.error('API 호출 실패:', error.response?.data || error.message);
        alert('데이터 저장 및 URL 생성에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  // ... (나머지 JSX 렌더링 부분은 기존과 동일합니다.) ...
  const questions = [
    '자신의 강점이 잘 드러난 경험 하나를 소개해주세요.',
    '가장 자신 있는 프로젝트 또는 작업 경험은 무엇인가요?',
    '협업 중 기억에 남는 순간이나 갈등 해결 사례가 있다면요?',
    '가장 힘들었지만 성장했다고 느낀 순간은 언제였나요?',
  ];

  return (
    <div className="prompt-wrapper">
      <img
        src="/fopofo-logo.png"
        alt="포포포 로고"
        className="logo"
        onClick={() => navigate('/mainpage')}
      />
      <div
        className="mypage"
        onClick={() => navigate('/mypage')}
      >
        my page
      </div>
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