import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
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
                    src="/fopofo-logo.png"
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
}

export default HomePage;