import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignupPage.css';
// 👇 1. 기존 api 대신 새로 만든 nodeApi를 가져옵니다.
import { nodeApi } from '../../services/api';

function SignupPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  // 👇 2. 회원가입 핸들러 내부의 API 호출을 nodeApi로 수정합니다.
  const handleSignUp = async () => {
    try {
      // nodeApi를 사용하고, 기본 URL 뒷부분인 '/users/signup'만 적어줍니다.
      const response = await nodeApi.post('/users/signup', { userId, password });

      alert('회원가입 성공!');
      navigate('/login'); // 회원가입 성공 후 로그인 페이지로 이동
    } catch (err) {
      console.error('회원가입 실패:', err.response?.data || err.message);
      alert('회원가입 실패! 이미 사용 중인 아이디일 수 있습니다.');
    }
  };

  const handleLogoClick = () => {
    navigate('/mainpage');
  };

  // --- 이 아래의 JSX 반환 부분은 기존과 동일합니다. ---
  return (
    <div className="signup-container">
      <img
        src="/images/fopofo-logo.png"
        alt="fopofo-logo"
        className="login-logo-img"
        onClick={handleLogoClick}
      />

      <div className="signup-box">
        <input
          type="text"
          className="signup-input"
          placeholder="ID: 아이디를 입력하세요"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <input
          type="password"
          className="signup-input"
          placeholder="PW: 비밀번호를 입력하세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="signup-button" onClick={handleSignUp}>
          회원 가입
        </button>
      </div>
    </div>
  );
}

export default SignupPage;