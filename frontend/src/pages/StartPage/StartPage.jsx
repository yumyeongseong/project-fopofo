import React from 'react';
import './StartPage.css';
import { useNavigate } from 'react-router-dom';

function StartPage() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/login');
  };

  return (
    <div className="start-page">
      <img
        src="/startpage-img.png"
        alt="배경"
        className="bg-img"
      />

      {/* 좌측 상단 로고 */}
      <img
        src="/images/fopofo-logo.png"
        alt="fopofo-logo"
        className="logo"
        onClick={() => navigate('/')}
      />

      {/* 중앙 텍스트 + 구분선 */}
      <div className="title-wrapper" onClick={handleClick}>
        <h1 className="text-slide-up">For Portfolio</h1>
        <div className="divider-line"></div>
        <h1 className="text-slide-down">For People</h1>
      </div>
    </div>
  );
}

export default StartPage;
