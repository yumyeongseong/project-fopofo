import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { nodeApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext'; // ✅ [기능] 전역 인증 상태 사용

function LoginPage() {
  const navigate = useNavigate();
  const { login, setUser } = useAuth(); // ✅ [기능] useAuth에서 login, setUser 함수 가져오기
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  // ✅ [기능] 구글 로그인 후 리다이렉트 처리 로직 (가장 안정적인 버전)
  useEffect(() => {
    const handleGoogleRedirect = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      if (token) {
        localStorage.setItem('token', token);
        try {
          const response = await nodeApi.get('/users/me');
          const userData = response.data.user; // user 객체 추출

          setUser(userData); // 전역 상태 업데이트
          alert('구글 로그인 성공!');

          // URL에서 토큰 파라미터 제거
          window.history.replaceState({}, document.title, window.location.pathname);

          // 닉네임 유무에 따라 페이지 이동
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

  // ✅ [기능] 일반 로그인 처리 로직 (가장 안정적인 버전)
  const handleLogin = async () => {
    try {
      const response = await nodeApi.post('/users/login', { userId, password });
      const { user } = response.data;

      login(response.data); // 전역 상태에 토큰과 user 정보 저장
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

  // ✅ [기능] 구글 로그인 URL을 환경변수에서 가져오는 안정적인 방식
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_NODE_URL}/api/auth/google`;
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  // ✅ [디자인] 디자이너의 JSX 구조 채택
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