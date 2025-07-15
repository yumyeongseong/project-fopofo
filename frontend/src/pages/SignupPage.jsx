import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SignupPage.css';

function SignupPage() {
    const navigate = useNavigate();

    const handleSignUp = () => {
        // 회원가입 성공 처리 후
        navigate('/home');
    };

    const handleLogoClick = () => {
        window.location.href = '/';
    };

    return (
        <div className="signup-container">
            <img
                src="/fopofo-logo.png"
                alt="fopofo-logo"
                className="signup-logo-img"
                onClick={handleLogoClick}
            />

            <div className="signup-box">
                <input
                    type="text"
                    className="signup-input"
                    placeholder="ID: 아이디를 입력하세요"
                />
                <input
                    type="password"
                    className="signup-input"
                    placeholder="PW: 비밀번호를 입력하세요"
                />

                {/* 여기 onClick 추가! */}
                <button className="signup-button" onClick={handleSignUp}>
                    회원 가입
                </button>
            </div>
        </div>
    );
}

export default SignupPage;