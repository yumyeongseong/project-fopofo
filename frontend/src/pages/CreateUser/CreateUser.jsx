import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateUser.css'; // ✅ 새로운 디자인의 CSS 파일을 사용합니다.
import { nodeApi } from "../../services/api";
import { useAuth } from '../../contexts/AuthContext';

function CreateUserPage() {
    // ✅ 1. 기존의 기능 로직을 그대로 가져옵니다. (logout 기능 추가)
    const navigate = useNavigate();
    const { updateUserNickname, logout } = useAuth();
    const [nickname, setNickname] = useState('');

    const handleSubmit = async () => {
        if (!nickname.trim()) {
            return alert('닉네임을 입력해주세요!');
        }

        try {
            await nodeApi.put('/api/users/set-nickname', { nickname });
            updateUserNickname(nickname);
            alert('닉네임이 설정되었습니다. 포트폴리오 업로드 페이지로 이동합니다.');
            navigate('/intro-upload');
        } catch (error) {
            alert(error.response?.data?.message || '오류가 발생했습니다.');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/mainpage');
    };

    // ✅ 2. 새로운 디자인(CreateUser1.jsx)의 JSX 구조와 className을 적용하고,
    //    위에서 정의한 함수들을 각 버튼과 입력창에 연결합니다.
    return (
        <div className="homepage-container">
            <div className="create-wrapper animate-fade-in">
                <img
                    src="/Fopofo-Logo-v2.png" // public 폴더의 로고 경로
                    alt="logo"
                    className="nav-logo"
                    onClick={() => navigate('/mainpage')}
                />

                <div className="noportfolio-top-buttons">
                    <button className="outline-btn" onClick={handleLogout}>logout</button>
                    <button className="outline-btn" onClick={() => navigate('/home')}>Exit</button>
                </div>

                <div className="create-center">
                    <h1 className="create-title animate-fade-in delay-1">
                        Let’s name your<br />portfolio!
                    </h1>

                    <div className="input-row animate-fade-in delay-2">
                        <input
                            type="text"
                            className="portfolio-input"
                            placeholder="사용할 닉네임을 입력하세요."
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSubmit();
                                }
                            }}
                        />

                        <button className="set-name-btn" onClick={handleSubmit}>
                            Set name
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateUserPage;