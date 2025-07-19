import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
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

  // ✅ 닉네임 유무에 따라 분기하는 팀원의 로직을 채택합니다.
  const handleLogin = async () => {
    try {
      const response = await nodeApi.post('/users/login', { userId, password });
      // 백엔드 응답에서 token과 user 객체를 모두 받습니다.
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      alert('로그인 성공!');

      // 닉네임 유무에 따라 다른 페이지로 이동합니다.
      if (user && user.nickname) {
        // 닉네임이 있으면 홈 페이지로 이동
        navigate('/home');
      } else {
        // 닉네임이 없으면 닉네임 생성(/create) 페이지로 이동
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

  return (
    <div className="login-container">
      <img
        src="/images/fopofo-logo.png"
        alt="fopofo-logo"
        className="login-logo-img"
        onClick={handleLogoClick}
      />

      <div className="login-box">
        <input
          type="text"
          className="login-input id-input"
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

        <div
          className="gsi-material-button"
          onClick={handleGoogleLogin}
        >
          {/* ... (SVG 코드는 생략) ... */}
          <span className="gsi-material-button-contents">Sign in with Google</span>
        </div>

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