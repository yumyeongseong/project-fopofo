import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChatbotPromptPage.css';
import { pythonApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

function ChatbotPromptPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [answers, setAnswers] = useState(['', '', '', '']);

  const handleChange = (index, value) => {
    setAnswers(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleSubmit = async () => {
    const allAnswered = answers.every(answer => answer.trim() !== '');
    if (!allAnswered) {
      alert('모든 질문에 답변해주세요!');
      return;
    }

    try {
      const questions = [
        "자신의 강점이 잘 드러난 경험 하나를 소개해주세요.",
        "가장 자신 있는 프로젝트 또는 작업 경험은 무엇인가요?",
        "협업 중 기억에 남는 순간이나 갈등 해결 사례가 있나요?",
        "가장 힘들었지만 성장했다고 느낀 순간은 언제였나요?",
      ];

      const answersData = {};
      questions.forEach((q, i) => {
        answersData[`question_${i + 1}`] = q;
        answersData[`answer_${i + 1}`] = answers[i];
      });

      await pythonApi.post('/save-answers', {
        answers: answersData
      });

      if (user && user.userId) {
        const portfolioUrl = `/portfolio/${user.userId}`;
        alert('질문 답변이 성공적으로 저장되었습니다!');
        navigate('/portfolio-created', { state: { portfolioUrl } });
      } else {
        alert('사용자 정보를 찾을 수 없어 URL을 생성할 수 없습니다. 다시 로그인해주세요.');
        navigate('/login');
      }
    } catch (error) {
      alert(error.response?.data?.detail || '데이터 저장 중 오류가 발생했습니다.');
    }
  };

  const questionsText = [
    '자신의 강점이 잘 드러난 경험 하나를 소개해주세요.',
    '가장 자신 있는 프로젝트 또는 작업 경험은 무엇인가요?',
    '협업 중 기억에 남는 순간이나 갈등 해결 사례가 있다면요?',
    '가장 힘들었지만 성장했다고 느낀 순간은 언제였나요?'
  ];

  return (
    <div className="homepage-container">
      <img
        src="/images/fopofo-logo.png"
        alt="logo"
        className="nav-logo"
        onClick={() => navigate('/home')}
      />
      {/* [수정] 'my page' 버튼을 'logout'과 'Exit' 버튼으로 교체 */}
      <div className="noportfolio-top-buttons">
        <button className="outline-btn" onClick={() => {
          // TODO: 실제 로그아웃 로직 구현 필요
          alert("로그아웃 되었습니다.");
          navigate("/login");
        }}>logout</button>
        <button className="outline-btn" onClick={() => navigate("/")}>Exit</button>
      </div>
      <div className="chatbot-prompt-container">
        <h1 className="chatbot-prompt-title animate-3d">
          Build your chatbot<br />with your stories
        </h1>
        <p className="chatbot-prompt-subtitle animate-3d">
          이력서에 담지 못한 당신의 이야기와 경험을 자유롭게 적어주세요!<br />
          (이 프롬프트는 챗봇이 면접관의 질문에 답변하는 데 활용됩니다.)
        </p>
        <div className="prompt-card animate-3d">
          {questionsText.map((q, i) => (
            <div key={i} className="prompt-box">
              <label>Q. {q}</label>
              <textarea
                placeholder="A."
                value={answers[i]}
                onChange={(e) => handleChange(i, e.target.value)}
              />
            </div>
          ))}
          <button className="chatbot-next-btn" onClick={handleSubmit}>Next</button>
        </div>
      </div>
    </div>
  );
}

export default ChatbotPromptPage;