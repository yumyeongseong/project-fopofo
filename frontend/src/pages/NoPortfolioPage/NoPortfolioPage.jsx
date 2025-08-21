import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NoPortfolioPage.css'; // ✅ 해당 CSS로만 스타일 적용

function NoPortfolioPage() {
    const navigate = useNavigate();

    return (
        <div className="homepage-container">
            <div className="noportfolio-wrapper">

                {/* 로고 - 왼쪽 상단 */}
                <img
                    src="/Fopofo-Logo-v2.png"
                    alt="logo"
                    className="nav-logo"
                    onClick={() => navigate('/')}
                />

                {/* 우측 상단 버튼 */}
                <div className="noportfolio-top-buttons">
                    <button className="outline-btn" onClick={() => navigate('/')}>logout</button>
                    <button className="outline-btn" onClick={() => navigate('/home')}>Exit</button>
                </div>

                {/* 중앙 콘텐츠 */}
                <div className="noportfolio-center">
                    <p className="no-portfolio-message">
                        아직 생성된 포트폴리오가 없어요 :(<br />
                        지금 바로 나만의 포트폴리오를 만들어보세요!
                    </p>
                    <button
                        className="back-to-create-btn fade-in-up"
                        onClick={() => navigate('/home')}
                    >
                        Back to Home Page
                    </button>
                </div>

            </div>
        </div>
    );
}

export default NoPortfolioPage;
