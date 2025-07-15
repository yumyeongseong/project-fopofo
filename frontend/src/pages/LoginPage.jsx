import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
    const navigate = useNavigate();

    const handleLogin = () => {
        // 로그인 성공 로직 실행 후
        navigate('/home'); // ✅ 홈으로 이동
    };
    const handleLogoClick = () => {
        navigate('/mainpage'); // 👉 시작화면으로 이동
    };
    const handleGoogleLogin = () => {
        navigate('/home');
        console.log('구글 로그인 시도'); // 실제 로그인 로직으로 교체 가능
    };

    const handleSignupClick = () => {
        navigate('/signup'); // 🔥 회원가입 페이지로 이동
    };

    return (
        <div className="login-container">
            {/* 로고 이미지 클릭 시 시작화면으로 이동 */}
            <img
                src="/fopofo-logo.png"
                alt="fopofo-logo"
                className="login-logo-img"
                onClick={handleLogoClick}
            />

            <div className="login-box">
                <input
                    type="text"
                    className="login-input id-input"
                    placeholder="ID: 아이디를 입력하세요"
                />
                <input
                    type="password"
                    className="login-input"
                    placeholder="PW: 비밀번호를 입력하세요"
                />

                {/* 구글 로그인 버튼 */}
                <div
                    className="gsi-material-button"
                    onClick={handleGoogleLogin}
                >
                    <div className="gsi-material-button-state"></div>
                    <div className="gsi-material-button-content-wrapper">
                        <div className="gsi-material-button-icon">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 48 48"
                                width="20"
                                height="20"
                                style={{ display: 'block' }}
                            >
                                <path
                                    fill="#EA4335"
                                    d="M24 9.5c3.5 0 6.1 1.2 8.2 2.9l6.1-6.1C34.5 2.9 29.7 1 24 1 14.7 1 6.7 6.6 3.3 14.1l7 5.4C12.3 13.2 17.7 9.5 24 9.5z"
                                />
                                <path
                                    fill="#4285F4"
                                    d="M46.5 24c0-1.3-.1-2.6-.4-3.8H24v7.2h12.7c-.6 3.1-2.4 5.7-5.2 7.5l8 6.2c4.6-4.2 7.3-10.3 7.3-17.1z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M10.3 28.4c-.5-1.4-.7-2.9-.7-4.4s.3-3 .7-4.4l-7-5.4C2.1 17.4 1 20.6 1 24s1.1 6.6 3.3 9.4l7-5.4z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M24 47c5.7 0 10.5-1.9 14-5.1l-8-6.2c-2.2 1.5-5 2.4-8 2.4-6.3 0-11.7-4.2-13.7-9.9l-7 5.4c3.4 7.5 11.4 13 20.7 13z"
                                />
                                <path fill="none" d="M0 0h48v48H0z" />
                            </svg>
                        </div>
                        <span className="gsi-material-button-contents">Sign in with Google</span>
                    </div>
                </div>

                {/* 회원가입 텍스트 → 버튼 아래로 이동 */}
                <p className="link-text" onClick={handleSignupClick} style={{ cursor: 'pointer' }}>
                    회원 가입
                </p>
            </div>

            <button className="login-button" onClick={handleLogin}>
                LOGIN
            </button>
        </div>
    );
}

export default LoginPage;