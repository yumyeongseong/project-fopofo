import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChatbotPromptPage.css'; // ✅ 새로운 디자인의 CSS 파일을 사용합니다.
import { pythonApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

function ChatbotPromptPage() {
    // ✅ 1. 기존의 안정적인 기능 로직을 모두 그대로 가져옵니다.
    const [answers, setAnswers] = useState(Array(4).fill(''));
    const navigate = useNavigate();
    const { user, logout } = useAuth(); // logout 기능도 가져옵니다.

    const questions = [
        '자신의 강점이 잘 드러난 경험 하나를 소개해주세요.',
        '가장 자신 있는 프로젝트 또는 작업 경험은 무엇인가요?',
        '협업 중 기억에 남는 순간이나 갈등 해결 사례가 있나요?',
        '가장 힘들었지만 성장했다고 느낀 순간은 언제였나요?',
    ];

    const handleChange = (index, value) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
    };

    // ✅ 2. 기존의 handleSubmit 로직을 그대로 사용합니다. (백엔드와 완벽 호환)
    const handleSubmit = async () => {
        const allAnswered = answers.every(answer => answer.trim() !== '');
        if (!allAnswered) {
            alert('모든 질문에 답변해주세요!');
            return;
        }

        try {
            const answersData = {};
            questions.forEach((q, i) => {
                answersData[`question_${i + 1}`] = q;
                answersData[`answer_${i + 1}`] = answers[i];
            });

            await pythonApi.post('/save-answers', { answers: answersData });

            alert('질문 답변이 성공적으로 저장되었습니다!');

            if (user && user.userId) {
                const portfolioUrl = `/portfolio/${user.userId}`;
                navigate('/portfolio-created', { state: { portfolioUrl: portfolioUrl } });
            } else {
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

    // ✅ 3. 새로운 디자인에 있던 추가 기능들을 가져옵니다.
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [answers, user]);

    const handleLogout = () => {
        logout();
        navigate('/mainpage');
    };
    
    // ✅ 4. 새로운 디자인(ChatbotPromptPage1.jsx)의 JSX 구조를 적용하고 모든 기능을 연결합니다.
    return (
        <div className="homepage-container">
            <img
                src="/Fopofo-Logo-v2.png"
                alt="logo"
                className="nav-logo"
                onClick={() => navigate('/mainpage')}
            />
            <div className="noportfolio-top-buttons">
                <button className="outline-btn" onClick={handleLogout}>logout</button>
                <button className="outline-btn" onClick={() => navigate('/home')}>Exit</button>
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
                    <button className="chatbot-next-btn" onClick={handleSubmit}>Next</button>
                </div>
            </div>
        </div>
    );
}

export default ChatbotPromptPage;