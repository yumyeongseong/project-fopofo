import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  const handleMyPageClick = () => {
    console.log('마이페이지 이동 예정');
  };

  return (
    <div className="home-container">
      {/* ✅ [구조/스타일 유지] 새로운 코드의 구조와 이미지 경로를 채택합니다. */}
      <img
        src="/images/fopofo-logo.png"
        alt="fopofo-logo"
        className="home-logo"
        onClick={() => navigate('/mainpage')}
      />
      <header className="home-header">
        <button className="mypage-button" onClick={handleMyPageClick}>
          my page
        </button>
      </header>

      <main className="home-main">
        <div className="main-title-box">
          <div
            className="create-button"
            onClick={() => navigate('/upload')}
          >
            Create Your Own Web Portfolio
          </div>
        </div>
      </main>
    </div>
  );
}

export default HomePage;