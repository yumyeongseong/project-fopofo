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
      await nodeApi.post('/users/signup', { userId, password });
      alert('회원가입 성공!');
      navigate('/login');
    } catch (err) {
      console.error('회원가입 실패:', err.response?.data || err.message);
      alert('회원가입 실패! 이미 사용 중인 아이디일 수 있습니다.');
    }
  };

  const handleLogoClick = () => {
    navigate('/');
  };

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
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSignUp(); // 엔터로도 회원가입 가능
            }
          }}
        />
        <button className="signup-button" onClick={handleSignUp}>
          회원 가입
        </button>
      </div>
    </div>
  );
}

export default SignupPage;