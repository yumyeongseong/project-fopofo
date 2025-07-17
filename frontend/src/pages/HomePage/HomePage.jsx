import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
<<<<<<< HEAD
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/mainpage'); // 👉 시작화면으로 이동
  };

  const handleMyPageClick = () => {
    console.log('마이페이지 이동 예정');
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <img
          src="/images/fopofo-logo.png"
          alt="fopofo-logo"
          className="home-logo"
          onClick={handleLogoClick}
        />
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
=======
    const navigate = useNavigate();

    const handleMyPageClick = () => {
        console.log('마이페이지 이동 예정');
    };

    return (
        <div className="home-container">
            <img
                src="/fopofo-logo.png"
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
                        onClick={() => navigate('/upload')}
                    >
                        Create Your Own Web Portfolio
                    </div>
                </div>
            </main>
        </div>
    );
>>>>>>> 48898a822c8a79aad1384cf59fd36da00566d2af
}

export default HomePage;