import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChatbotPromptPage.css';
import axios from 'axios'; // ✅ axios 임포트 추가

const ChatbotPromptPage = () => {
  const [answers, setAnswers] = useState(Array(4).fill(''));
  const navigate = useNavigate();

  const handleChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  // ✅ 수정된 부분: handleSubmit 함수에 백엔드 API 연동 로직 추가
  const handleSubmit = async () => {
    // 모든 질문에 답변했는지 확인 (필요시)
    const allAnswered = answers.every(answer => answer.trim() !== '');
    if (!allAnswered) {
      alert('모든 질문에 답변해주세요!');
      return;
    }

    console.log('프롬프트 응답:', answers); // 로컬 콘솔 로그 유지

    try {
      const token = localStorage.getItem('token'); // JWT 토큰 가져오기
      if (!token) {
        alert('로그인이 필요합니다.');
        navigate('/login');
        return;
      }

      // 백엔드로 전송할 데이터 형식 (질문과 답변을 매핑)
      // questions 배열과 answers 배열을 합쳐 객체로 만듭니다.
      const questions = [ // ChatbotPromptPage.jsx의 questions 배열과 동일
        '자신의 강점이 잘 드러난 경험 하나를 소개해주세요.',
        '가장 자신 있는 프로젝트 또는 작업 경험은 무엇인가요?',
        '협업 중 기억에 남는 순간이나 갈등 해결 사례가 있다면요?',
        '가장 힘들었지만 성장했다고 느낀 순간은 언제였나요?',
      ];
      const answersData = {};
      questions.forEach((q, i) => {
        answersData[`question_${i + 1}`] = q; // 질문 자체도 저장
        answersData[`answer_${i + 1}`] = answers[i]; // 사용자 답변 저장
      });

      // FastAPI 백엔드 URL: http://localhost:8000
      const response = await axios.post('http://localhost:8000/save-answers', {
        answers: answersData // FastAPI의 AnswersRequest 모델과 일치
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // JWT 토큰 첨부
        }
      });

      console.log('질문 답변 MongoDB 저장 완료:', response.data);
      alert('질문 답변이 성공적으로 저장되었습니다!');
      // 다음 페이지로 이동 (예: 최종 포트폴리오 생성 확인 페이지)
      // navigate('/portfolio-generation-summary');
    } catch (error) {
      console.error('질문 답변 저장 실패:', error.response?.data || error.message);
      alert('질문 답변 저장에 실패했습니다. 다시 시도해주세요.');
      if (error.response?.data) {
        console.error('FastAPI Error Detail:', error.response.data.detail);
      }
    }
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