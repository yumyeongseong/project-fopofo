import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { useLocation, useNavigate } from 'react-router-dom'; // ✅ 수정된 부분: useLocation 임포트 추가
import './PortfolioCreatedPage.css';

function PortfolioCreatedPage() {
  const [copied, setCopied] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showQR, setShowQR] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const location = useLocation(); // ✅ 추가: useLocation 훅 사용
  const navigate = useNavigate(); // ✅ useNavigate 훅 사용 (로고 클릭 시)

  // ✅ 수정된 부분: URL을 location.state에서 받아오거나 기본값 설정
  const [portfolioUrl, setPortfolioUrl] = useState('https://forportfolioforpeople.com/default-id'); // 기본 URL
  // 또는, location.state가 없는 경우를 대비하여 초기값으로 빈 문자열이나 로딩 메시지
  // const [portfolioUrl, setPortfolioUrl] = useState(''); 

  // ✅ 추가된 부분: 컴포넌트 마운트 시 location.state에서 portfolioUrl 설정
  useEffect(() => {
    if (location.state && location.state.portfolioUrl) {
      setPortfolioUrl(location.state.portfolioUrl);
      console.log("Received Portfolio URL:", location.state.portfolioUrl);
    } else {
      console.warn("Portfolio URL not received in state. Using default.");
      // 오류 처리: URL이 전달되지 않았다면 사용자에게 알리거나 기본 페이지로 리다이렉트
      alert("포트폴리오 URL을 받아오지 못했습니다. 다시 시도해주세요.");
      navigate('/prompt/chatbot'); // 예: 다시 프롬프트 페이지로 돌려보냄
    }
  }, [location.state, navigate]); // location.state 또는 navigate가 변경될 때마다 실행


  const handleCopy = async () => {
    // ✅ 수정된 부분: portfolioUrl이 유효한지 확인 후 복사
    if (portfolioUrl && portfolioUrl !== 'https://forportfolioforpeople.com/default-id') {
      try {
        await navigator.clipboard.writeText(portfolioUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        alert('복사에 실패했어요 😢');
      }
    } else {
      alert('복사할 포트폴리오 URL이 유효하지 않습니다.');
    }
  };

  // ✅ 생성 진행률 및 QR 코드 표시 로직
  useEffect(() => {
    // portfolioUrl이 아직 기본값이면 타이머 시작 안함 (선택 사항)
    if (!portfolioUrl || portfolioUrl === 'https://forportfolioforpeople.com/default-id') return;

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
  }, [portfolioUrl]); // ✅ 수정된 부분: portfolioUrl이 설정된 후에 타이머가 시작되도록 의존성 추가 (선택 사항)


  return (
    <div className="url-page-wrapper">
      <img
        src="/images/fopofo-logo.png" // ✅ 이미지 경로 수정 (오류 방지)
        alt="fopofo-logo"
        className="logo"
        onClick={() => navigate('/mainpage')} // ✅ 수정: navigate 사용 (window.location.href 대신)
      />

      <div
        className={`final-banner ${isCreated ? 'hoverable' : ''}`}
        onClick={() => {
          if (isCreated && portfolioUrl && portfolioUrl !== 'https://forportfolioforpeople.com/default-id') {
            window.open(portfolioUrl, '_blank'); // ✅ 동적 URL 사용
          }
        }}
      >
        <div className="url-title-box">
          <h1>PORTFOLIO<br />IS CREATED</h1>
        </div>
      </div>

      <div className="url-box-custom">
        <div className="url-label">URL</div>
        <div className="url-display">{portfolioUrl}</div> {/* ✅ 동적 URL 표시 */}
        <button className="copy-button-custom" onClick={handleCopy}>복사</button>
      </div>

      {copied && <span className="copy-feedback">링크가 복사되었습니다!</span>}

      {!showQR ? (
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
      ) : (
        <div className="qr-wrapper">
          {/* ✅ QR 코드도 동적 URL 사용 */}
          {portfolioUrl && portfolioUrl !== 'https://forportfolioforpeople.com/default-id' && (
            <QRCode value={portfolioUrl} size={100} />
          )}
          <p className="qr-label">QR 코드로 접속해보세요</p>
        </div>
      )}
    </div>
  );
}

export default PortfolioCreatedPage;