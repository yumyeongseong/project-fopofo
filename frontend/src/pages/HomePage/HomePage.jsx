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
      <img
        src="/images/fopofo-logo.png" // ✅ 로고 경로 통일
        alt="fopofo-logo"
        className="home-logo"
        onClick={() => navigate('/mainpage')}
      />
      <header className="home-header">
        <button className="mypage-button-home" onClick={handleMyPageClick}>
          my page
        </button>
      </header>

      <main className="home-main">
        <div className="main-title-box">
          <div
            className="create-button"
            onClick={() => navigate('/create')} // ✅ '/create' 경로로 통일
          >
            Create Your Own Web Portfolio
          </div>
        </div>
      </main>
    </div>
  );
}

export default HomePage;