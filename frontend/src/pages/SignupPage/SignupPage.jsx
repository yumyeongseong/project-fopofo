import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignupPage.css';
import { nodeApi } from '../../services/api';

function SignupPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      // ✅ [연동 확인] Node.js 서버의 회원가입 API로 정상적으로 요청됩니다.
      await nodeApi.post('/users/signup', { userId, password });
      alert('회원가입 성공!');
      navigate('/login');
    } catch (err) {
      console.error('회원가입 실패:', err.response?.data || err.message);
      alert(err.response?.data?.message || '회원가입에 실패했습니다.');
    }
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  // 👇 [병합] 완전한 형태의 JSX 코드를 채택합니다.
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