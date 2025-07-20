import React from 'react';
import './GoogleLoginButton.css';

function GoogleLoginButton() {
    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:5000/api/auth/google'; // 백엔드 OAuth 경로
    };

    return (
        <button className="google-login-button" onClick={handleGoogleLogin}>
            <img
                src="/images/google-icon.png"
                alt="google"
                className="google-icon"
            />
            <span className="google-text">Sign in with Google</span>
        </button>
    );
}

export default GoogleLoginButton;
