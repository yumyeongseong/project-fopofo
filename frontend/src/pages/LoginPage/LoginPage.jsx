import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
// 👇 1. 기존 api 대신 새로 만든 nodeApi를 가져옵니다.
import { nodeApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

function LoginPage() {
  const navigate = useNavigate();
  const { login, setUser } = useAuth()
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const handleGoogleRedirect = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      if (token) {
        localStorage.setItem('token', token);

        try {
          // 1. 토큰으로 서버에 내 정보를 요청합니다.
          const response = await nodeApi.get('/users/me');
          const userData = response.data;

          setUser(userData); // 로그인 상태를 앱 전체에 알립니다.
          alert('구글 로그인 성공!');

          // URL에서 토큰 파라미터를 깔끔하게 제거합니다.
          window.history.replaceState({}, document.title, window.location.pathname);

          // ✅ --- 여기가 핵심 수정 부분입니다 --- ✅
          // 2. 받아온 사용자 정보에 닉네임(nickname)이 있는지 확인합니다.
          if (userData && userData.nickname) {
            // 3. 닉네임이 있으면, 홈 페이지로 이동합니다.
            navigate('/home');
          } else {
            // 4. 닉네임이 없으면, 닉네임 생성 페이지('/create')로 이동합니다.
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

  // 👇 2. 로그인 핸들러 내부의 API 호출을 nodeApi로 수정합니다.
  const handleLogin = async (e) => {
    try {
      const response = await nodeApi.post('/users/login', { userId, password });
      const { user } = response.data;

      login(response.data);

      alert('로그인 성공!');

      // ✅ 닉네임 유무에 따라 다른 페이지로 이동
      if (user && user.nickname) {
        // 닉네임이 있으면 홈(또는 업로드) 페이지로 이동
        navigate('/home');
      } else {
        // 닉네임이 없으면 닉네임 생성 페이지로 이동
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

  // Google 로그인 URL은 그대로 유지합니다.
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_BACKEND_URL}/api/auth/google`;
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  // --- 이 아래의 JSX 반환 부분은 기존과 동일합니다. ---
  return (
    <div className="login-container">
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