import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import './PortfolioCreatedPage.css';

function PortfolioCreatedPage() {
  const [copied, setCopied] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state && location.state.portfolioUrl) {
      const fullUrl = new URL(location.state.portfolioUrl, window.location.origin).href;
      setPortfolioUrl(fullUrl);
    } else {
      alert("잘못된 접근입니다. 메인 페이지로 이동합니다.");
      navigate('/home');
      return; // useEffect 중단
    }

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setShowContent(true);
          setIsCreated(true);
          return 100;
        }
        return prev + 1;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [location.state, navigate]);

  const handleCopy = async () => {
    if (!portfolioUrl) return;
    try {
      await navigator.clipboard.writeText(portfolioUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert('복사에 실패했어요 😢');
    }
  };

  return (
    <div className="url-page-wrapper">
      <img src="/images/fopofo-logo.png" alt="fopofo-logo" className="nav-logo" onClick={() => navigate('/home')} />
      {/* [수정] 'my page' 버튼을 'logout'과 'Exit' 버튼으로 교체 */}
      <div className="noportfolio-top-buttons">
        <button className="outline-btn" onClick={() => {
          // TODO: 실제 로그아웃 로직 구현 필요
          alert("로그아웃 되었습니다.");
          navigate("/login");
        }}>logout</button>
        <button className="outline-btn" onClick={() => navigate("/")}>Exit</button>
      </div>

      <div className={`final-banner ${isCreated ? 'hoverable' : ''}`} onClick={() => { if (isCreated) window.open(portfolioUrl, '_blank'); }}>
        <div className="url-title-box animate-3d">
          <h1>PORTFOLIO<br />IS CREATED</h1>
        </div>
      </div>

      {copied && <span className="copy-feedback">링크가 복사되었습니다!</span>}

      {!showContent ? (
        <>
          <div className="progress-container animate-3d">
            <div className="progress-bar" style={{ width: `${progress}%` }} />
          </div>
          <p className="loading-text">생성중...</p>
        </>
      ) : (
        <div className="content-reveal">
          <div className="url-box-custom">
            <div className="url-label">URL</div>
            <div className="url-display"><span>{portfolioUrl}</span></div>
            <button className="copy-button-custom" onClick={handleCopy}>복사</button>
          </div>
          <div className="qr-wrapper">
            <QRCode value={portfolioUrl} size={100} />
            <p className="qr-label">QR 코드로 접속해보세요</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default PortfolioCreatedPage;