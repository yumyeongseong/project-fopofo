import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import './PortfolioCreatedPage.css';

function PortfolioCreatedPage() {
  const [copied, setCopied] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showQR, setShowQR] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [urlVisible, setUrlVisible] = useState(false);
  const [portfolioUrl, setPortfolioUrl] = useState(''); // ✅ 백엔드 연동 시 대체될 동적 값

  const navigate = useNavigate();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(portfolioUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert('복사에 실패했어요 😢');
    }
  };

  useEffect(() => {
    // ✅ 추후 팀장님 연동 시 여기에 API 연결만 하면 됩니다.
    // 예:
    // fetch('/api/create-portfolio')
    //   .then(res => res.json())
    //   .then(data => {
    //     setPortfolioUrl(data.url);
    //     setUrlVisible(true);
    //     setIsCreated(true);
    //     setShowQR(true);
    //   });

    // 임시 로딩 시뮬레이션용
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // 실제로는 위 fetch 내에서 받아올 URL로 대체됨
          setPortfolioUrl('https://forportfolioforpeople.com/your-id');
          setUrlVisible(true);
          setIsCreated(true);
          setShowQR(true);
          return 100;
        }
        return prev + 1;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="url-page-wrapper">
      {/* 로고 */}
      <img
        src="/images/fopofo-logo.png"
        alt="fopofo-logo"
        className="nav-logo"
        onClick={() => navigate('/')}
      />

      {/* 로그아웃 & Exit 버튼 */}
      <div className="noportfolio-top-buttons">
        <button className="outline-btn" onClick={() => navigate('/')}>logout</button>
        <button className="outline-btn" onClick={() => navigate('/home')}>Exit</button>
      </div>

      {/* 포트폴리오 생성 타이틀 */}
      <div
        className={`final-banner ${isCreated ? 'hoverable' : ''}`}
        onClick={() => {
          if (isCreated) {
            window.open(portfolioUrl, '_blank');
          }
        }}
      >
        <div className="url-title-box animate-3d">
          <h1>PORTFOLIO<br />IS CREATED</h1>
        </div>
      </div>

      {/* URL 박스 */}
      <div className="url-box-custom animate-3d">
        <div className="url-label">URL</div>
        <div className="url-display">
          {urlVisible ? (
            <span>{portfolioUrl}</span>
          ) : (
            <span className="loading-placeholder">URL 생성 중...</span>
          )}
        </div>
        <button
          className="copy-button-custom"
          onClick={handleCopy}
          disabled={!urlVisible}
        >
          복사
        </button>
      </div>

      {copied && <span className="copy-feedback">링크가 복사되었습니다!</span>}

      {/* 로딩 바 & 생성중 텍스트 */}
      {!showQR && (
        <>
          <div className="progress-container animate-3d">
            <div className="progress-bar" style={{ width: `${progress}%` }} />
          </div>
          <p className="loading-text">생성중...</p>
        </>
      )}

      {/* QR 코드 */}
      {showQR && (
        <div className="qr-wrapper">
          <QRCode value={portfolioUrl} size={100} />
          <p className="qr-label">QR 코드로 접속해보세요</p>
        </div>
      )}
    </div>
  );
}

export default PortfolioCreatedPage;
