import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  const handleMyPageClick = () => {
    navigate('/mypage');
  };

  return (
    <div className="home-container">
      {/* ✅ 1. 결정에 따라 로고 이미지 경로를 수정했습니다. */}
      <img
        src="/images/fopofo-logo.png"
        alt="fopofo-logo"
        className="home-logo"
        onClick={() => navigate('/mainpage')}
      />
      <header className="home-header">
        {/* CSS 파일과의 일관성을 위해 클래스명을 'mypage-button-home'으로 통일합니다. */}
        <button className="mypage-button-home" onClick={handleMyPageClick}>
          my page
        </button>
      </header>

      <main className="home-main">
        <div className="main-title-box">
          <div
            className="create-button"
            // ✅ 2. 결정에 따라 '/create' 경로로 이동하도록 수정했습니다.
            onClick={() => navigate('/create')}
          >
            Create Your Own Web Portfolio
          </div>
        </div>
      </main>
    </div>
  );
}

export default HomePage;