import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import './PortfolioCreatedPage.css';

function PortfolioCreatedPage() {
  const [copied, setCopied] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showQR, setShowQR] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [portfolioUrl, setPortfolioUrl] = useState(''); // 초기값은 빈 문자열로 설정

  const location = useLocation();
  const navigate = useNavigate();

  // ✅ 팀원의 안정적인 URL 수신 및 예외 처리 로직을 채택합니다.
  useEffect(() => {
    if (location.state && location.state.portfolioUrl) {
      setPortfolioUrl(location.state.portfolioUrl);
    } else {
      console.error("포트폴리오 URL이 전달되지 않았습니다.");
      alert("잘못된 접근입니다. 메인 페이지로 이동합니다.");
      navigate('/mainpage');
    }
  }, [location.state, navigate]);

  // ✅ 내 버전의 Progress Bar 애니메이션 로직을 가져옵니다.
  useEffect(() => {
    if (!portfolioUrl) return; // URL이 설정된 후에만 애니메이션 시작

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setShowQR(true);
          setIsCreated(true);
          return 100;
        }
        return prev + 1;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [portfolioUrl]);

  const handleCopy = async () => {
    if (portfolioUrl) {
      try {
        await navigator.clipboard.writeText(portfolioUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        alert('복사에 실패했어요 😢');
      }
    }
  };

  return (
    <div className="url-page-wrapper">
      {/* ✅ 로고 경로와 내비게이션 방식을 통일합니다. */}
      <img
        src="/images/fopofo-logo.png"
        alt="fopofo-logo"
        className="logo"
        onClick={() => navigate('/mainpage')}
      />

      <div
        className={`final-banner ${isCreated ? 'hoverable' : ''}`}
        onClick={() => {
          if (isCreated && portfolioUrl) {
            window.open(portfolioUrl, '_blank');
          }
        }}
      >
        <div className="url-title-box">
          <h1>PORTFOLIO<br />IS CREATED</h1>
        </div>
      </div>

      <div className="url-box-custom">
        <div className="url-label">URL</div>
        <div className="url-display">{portfolioUrl}</div>
        <button className="copy-button-custom" onClick={handleCopy}>복사</button>
      </div>

      {copied && <span className="copy-feedback">링크가 복사되었습니다!</span>}

      {!showQR ? (
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
      ) : (
        <div className="qr-wrapper">
          {portfolioUrl && <QRCode value={portfolioUrl} size={100} />}
          <p className="qr-label">QR 코드로 접속해보세요</p>
        </div>
      )}
    </div>
  );
}

export default PortfolioCreatedPage;