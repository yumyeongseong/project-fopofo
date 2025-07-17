import React, { useState, useEffect } from 'react'; // ✅ 수정된 부분: useEffect 임포트 추가
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import api from '../../services/api'; // ✅ axios 인스턴스 import

function LoginPage() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  // ✅ 수정된 부분: 컴포넌트 마운트 시 URL 파싱 로직 추가
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token'); // URL에서 'token' 파라미터 추출

    if (token) {
      localStorage.setItem('token', token); // 추출한 토큰을 localStorage에 저장
      alert('구글 로그인 성공!');
      // URL에서 토큰 파라미터 제거 (선택 사항, 깔끔한 URL 유지를 위함)
      window.history.replaceState({}, document.title, window.location.pathname);
      navigate('/home'); // 로그인 후 홈 페이지로 이동
    }
  }, [navigate]); // navigate가 변경될 때마다 useEffect가 다시 실행되지 않도록 의존성 배열에 추가

  const handleLogin = async () => {
    try {
      const response = await api.post('/users/login', { userId, password });

      const token = response.data.token;
      if (token) {
        localStorage.setItem('token', token); // ✅ 토큰 저장
        alert('로그인 성공!');
        navigate('/home');
      } else {
        alert('로그인 실패: 토큰이 없습니다.');
      }
    } catch (err) {
      console.error('로그인 실패:', err.response?.data || err.message);
      alert('로그인 실패! 아이디 또는 비밀번호를 확인해주세요.');
    }
  };

  const handleLogoClick = () => {
    navigate('/mainpage');
  };

  // ✅ 수정된 부분: Google 로그인 버튼 클릭 시 백엔드 URL로 리다이렉트
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google'; // 백엔드의 Google 로그인 시작 URL
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
          onClick={handleGoogleLogin} // ✅ 수정된 부분: handleGoogleLogin 함수 연결
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