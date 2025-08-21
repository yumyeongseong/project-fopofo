import React from 'react';
import './GoogleLoginButton.css';
// 🚨 1. public 폴더의 파일을 import하는 이 라인을 삭제합니다.
// import googleIcon from '../../public/google-icon.svg'; 

function GoogleLoginButton() {
    const handleGoogleLogin = () => {
        window.location.href = 'https://www.my-fortpoilo-fopofo.com/api/auth/google';
    };

    return (
        <button className="google-login-button" onClick={handleGoogleLogin}>
            <img
                // ✅ 2. public 폴더의 파일은 이렇게 절대 경로로 사용합니다.
                // process.env.PUBLIC_URL이 public 폴더를 가리킵니다.
                src={process.env.PUBLIC_URL + '/google-icon.svg'}
                alt="google"
                className="google-icon"
            />
            <span className="google-text">Sign in with Google</span>
        </button>
    );
}

export default GoogleLoginButton;
