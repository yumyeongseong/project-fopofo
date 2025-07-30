import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { nodeApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
// ✅ 1. 별도의 GoogleLoginButton 컴포넌트를 가져옵니다.
// (실제 파일 위치에 따라 경로를 수정해야 할 수 있습니다.)
import GoogleLoginButton from '../../components/GoogleLoginButton/GoogleLoginButton';

function LoginPage() {
  const navigate = useNavigate();
  const { login, setUser } = useAuth();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  // 구글 로그인 후 리다이렉트 처리 로직
  useEffect(() => {
    const handleGoogleRedirect = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      if (token) {
        localStorage.setItem('token', token);
        try {
          const response = await nodeApi.get('/users/me');
          const userData = response.data.user;

          setUser(userData);
          alert('구글 로그인 성공!');

          window.history.replaceState({}, document.title, window.location.pathname);

          if (userData && userData.nickname) {
            navigate('/home');
          } else {
            navigate('/create');
          }
        } catch (error) {
          console.error("사용자 정보 가져오기 실패:", error);
          alert("로그인 처리 중 오류가 발생했습니다.");
          navigate('/login');
        }
      }
    };
    handleGoogleRedirect();
  }, [navigate, setUser]);

  // 일반 로그인 처리 로직
  const handleLogin = async () => {
    try {
      const response = await nodeApi.post('/users/login', { userId, password });
      const { user } = response.data;

      login(response.data);
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
    navigate('/');
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  // ✅ 2. LoginPage 내부에 있던 중복된 handleGoogleLogin 함수는 삭제되었습니다.

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
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleLogin();
              }
            }}
          />
        </div>

        {/* ✅ 3. 기존 버튼 대신 import한 컴포넌트를 사용합니다. */}
        <GoogleLoginButton />

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