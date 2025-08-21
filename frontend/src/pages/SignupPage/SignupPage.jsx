import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignupPage.css'; // ✅ 새로운 디자인의 CSS 파일을 사용합니다.
import { nodeApi } from '../../services/api';

function SignupPage() {
    // ✅ 1. 기능이 완벽한 기존 SignupPage.jsx의 로직을 그대로 사용합니다.
    const navigate = useNavigate();
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = async () => {
        try {
            const response = await nodeApi.post('/api/auth/signup', { userId, password });
            alert('회원가입 성공!');
            navigate('/login');
        } catch (err) {
            console.error('회원가입 실패:', err.response?.data || err.message);
            alert('회원가입 실패! 이미 사용 중인 아이디일 수 있습니다.');
        }
    };

    const handleLogoClick = () => {
        navigate('/mainpage'); // ✅ mainpage로 가는 것이 더 적절해 보입니다.
    };

    // ✅ 2. 새로운 디자인(SignupPage1.jsx)의 JSX 구조와 className을 적용합니다.
    // 여기에는 ID와 PASSWORD 입력창, 단 두 개만 있습니다.
    return (
        <div className="signup-container">
            <img
                src="/Fopofo-Logo-v2.png" // public 폴더의 로고 경로
                alt="fopofo-logo"
                className="login-logo-img"
                onClick={handleLogoClick}
            />

            <div className="signup-box">
                <input
                    type="text"
                    className="signup-input"
                    placeholder="ID: 아이디를 입력하세요"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />
                <input
                    type="password"
                    className="signup-input"
                    placeholder="PW: 비밀번호를 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSignUp();
                        }
                    }}
                />
                <button className="signup-button" onClick={handleSignUp}>
                    회원 가입
                </button>
            </div>
        </div>
    );
}

export default SignupPage;