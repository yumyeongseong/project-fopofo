import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

// ✅ 연동 관련된 코드 (팀장 코드)
import { nodeApi } from '../../services/api';

function LoginPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      localStorage.setItem('token', token);
      alert('구글 로그인 성공!');
      window.history.replaceState({}, document.title, window.location.pathname);
      navigate('/home');
    }
  }, [navigate]);

  // ✅ 로그인 로직 (팀장 코드 기반)
  const handleLogin = async () => {
    try {
      const response = await nodeApi.post('/users/login', { userId, password });
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      alert('로그인 성공!');

      if (user && user.nickname) {
        navigate('/home');
      } else {
        navigate('/create');
      }
    } catch (err) {
      console.error('로그인 실패:', err.response?.data || err.message);
      alert(err.response?.data?.message || '아이디 또는 비밀번호를 확인해주세요.');
    }
  };

  const handleLogoClick = () => {
    navigate('/mainpage');
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  // ✅ UI 구조는 지현 코드 기준
  return (
    <div className="login-container">
      <img
        src="/images/fopofo-logo.png"
        alt="fopofo-logo"
        className="login-logo-img"
        onClick={handleLogoClick}
      />

      <div className="login-box">
        <div className="input-group">
          <input
            type="text"
            className="login-input"
            placeholder="ID: 아이디를 입력하세요"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <input
            type="password"
            className="login-input"
            placeholder="PW: 비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="google-login-button" onClick={handleGoogleLogin}>
          <img src="/google-icon.svg" alt="Google" className="google-icon" />
          <span>Sign in with Google</span>
        </button>

        <p className="link-text" onClick={handleSignupClick}>
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
