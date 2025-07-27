// src/pages/ChatbotPromptPage/ChatbotPromptPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChatbotPromptPage.css';
import { pythonApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext'; // ✅ AuthContext 경로 확인 필요

const ChatbotPromptPage = () => {
  const [answers, setAnswers] = useState(Array(4).fill(''));
  const navigate = useNavigate();
  const { user } = useAuth(); // ✅ 로그인된 사용자 정보를 가져오기 위해 useAuth 사용

  const handleChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  // ✅ --- 이 handleSubmit 함수 전체의 로직을 수정합니다 --- ✅
  const handleSubmit = async () => {
    console.log('✅ handleSubmit 시작, useAuth()에서 가져온 user 객체:', user);
    const allAnswered = answers.every(answer => answer.trim() !== '');
    if (!allAnswered) {
      alert('모든 질문에 답변해주세요!');
      return;
    }

    try {
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

      // 1. 질문 답변 저장 API 호출 (이 부분은 정상입니다)
      await pythonApi.post('/save-answers', {
        answers: answersData
      });

      console.log('질문 답변 MongoDB 저장 완료');
      alert('질문 답변이 성공적으로 저장되었습니다! 포트폴리오 생성 완료 페이지로 이동합니다.');

      // ✅ 2. 불필요하고 잘못된 API 호출을 삭제합니다.
      // const generateUrlResponse = await pythonApi.post('/chat', {}); // 🚨 이 라인 삭제!

      // ✅ 3. 로그인된 사용자 정보를 이용해 올바른 공유 URL을 직접 만듭니다.
      if (user && user.userId) {
        const portfolioUrl = `/portfolio/${user.userId}`;
        console.log('생성된 포트폴리오 URL 경로:', portfolioUrl);

        // ✅ 4. 생성된 URL을 다음 페이지로 전달하며 이동합니다.
        navigate('/portfolio-created', { state: { portfolioUrl: portfolioUrl } });
      } else {
        // 혹시 모를 예외 처리
        alert('사용자 정보를 찾을 수 없어 URL을 생성할 수 없습니다. 다시 로그인해주세요.');
        navigate('/login');
      }

    } catch (error) {
      if (error.response?.status === 401) {
        alert('인증 정보가 유효하지 않습니다. 다시 로그인해주세요.');
        navigate('/login');
      } else {
        console.error('API 호출 실패:', error.response?.data || error.message);
        alert('데이터 저장 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  // --- ⬇️ 이 아래의 JSX 렌더링 부분은 전혀 수정되지 않았습니다 ⬇️ ---
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