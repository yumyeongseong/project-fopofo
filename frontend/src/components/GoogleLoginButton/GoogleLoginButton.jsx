import React from 'react';
import './GoogleLoginButton.css';

function GoogleLoginButton() {
  const handleGoogleLogin = () => {
    // ✅ 1. 환경 변수에서 API 서버의 기본 URL을 가져옵니다.
    const apiUrl = process.env.REACT_APP_API_URL;
    // ✅ 2. 기본 URL에 API 경로를 조합하여 전체 주소를 만듭니다.
    window.location.href = `${apiUrl}/api/auth/google`;
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