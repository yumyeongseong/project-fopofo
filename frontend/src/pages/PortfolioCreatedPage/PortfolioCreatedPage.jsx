import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import './PortfolioCreatedPage.css';

function PortfolioCreatedPage() {
  const [copied, setCopied] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showQR, setShowQR] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [portfolioUrl, setPortfolioUrl] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  // ✅ 팀장 코드 기준: URL을 useLocation으로 안전하게 전달받고 예외 처리
  useEffect(() => {
    if (location.state && location.state.portfolioUrl) {
      setPortfolioUrl(location.state.portfolioUrl);
    } else {
      console.error("포트폴리오 URL이 전달되지 않았습니다.");
      alert("잘못된 접근입니다. 메인 페이지로 이동합니다.");
      navigate('/mainpage');
    }
  }, [location.state, navigate]);

  // ✅ 지현 코드 기준: URL 있는 경우에만 Progress 애니메이션 시작
  useEffect(() => {
    if (!portfolioUrl) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
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
      {/* ✅ 지현 기준 로고 경로 및 마이페이지 버튼 */}
      <img
        src="/images/fopofo-logo.png"
        alt="fopofo-logo"
        className="logo"
        onClick={() => navigate('/mainpage')}
      />
      <button
        className="mypage-button-created"
        onClick={() => navigate('/mypage')}
      >
        my page
      </button>

      {/* ✅ 배너 클릭 시 웹사이트 오픈 (팀장 로직 유지) */}
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

      {/* ✅ URL 출력 및 복사 버튼 (지현 스타일 유지) */}
      <div className="url-box-custom">
        <div className="url-label">URL</div>
        <div className="url-display">{portfolioUrl}</div>
        <button className="copy-button-custom" onClick={handleCopy}>복사</button>
      </div>

      {copied && <span className="copy-feedback">링크가 복사되었습니다!</span>}

      {/* ✅ QR 코드 생성 */}
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
