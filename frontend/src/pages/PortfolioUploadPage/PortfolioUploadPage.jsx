// src/pages/PortfolioUploadPage/PortfolioUploadPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PortfolioUploadPage.css';

function PortfolioUploadPage() {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/mainpage'); // 로고 클릭 시 시작화면으로 이동
  };

  const handleNextClick = () => {
    // ✅ 기존 코드의 페이지 이동 기능 반영
    navigate('/upload/chatbot');
  };

  return (
    <div className="upload-container">
      <header className="upload-header">
        {/* ✅ 새로운 코드의 이미지 경로 스타일 반영 */}
        <img
          src="/images/fopofo-logo.png"
          alt="logo"
          className="upload-logo"
          onClick={handleLogoClick}
        />
        <button className="mypage-button">my page</button>
      </header>

      <main className="upload-main">
        <h1 className="upload-title">Upload files for Portfolio</h1>
        <div className="upload-content-wrapper">
          <div className="upload-box">
            <input type="file" className="file-input" />
            <p className="file-tip">
              *파일명은 각 작품에 해당하는 작품명에 반영됩니다.
            </p>
          </div>

          <div className="preview-box">
            <div className="preview">PREVIEW</div>
          </div>
        </div>
      </main>

      <footer className="upload-footer">
        <button className="next-button" onClick={handleNextClick}>
          Next
        </button>
      </footer>
    </div>
  );
}

export default PortfolioUploadPage;