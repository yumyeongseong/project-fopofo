import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { toPng } from 'html-to-image'; // ✅ QR 다운로드를 위해 import
import './PortfolioCreatedPage.css';
import { useAuth } from '../../contexts/AuthContext'; // ✅ 로그아웃을 위해 import

function PortfolioCreatedPage() {
    // ✅ 1. 기존의 안정적인 로직들을 그대로 가져옵니다.
    const [copied, setCopied] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showElements, setShowElements] = useState(false);
    const [portfolioPath, setPortfolioPath] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const qrCodeRef = useRef(null); // ✅ QR 코드 DOM 요소를 참조하기 위해 useRef 사용

    // ✅ 2. 배포 시 수정하기 쉽도록 URL을 만드는 부분을 분리합니다.
    // --- 이 부분을 배포 시 실제 도메인으로 변경하세요 ---
    const DOMAIN = 'https://staging.d1dbfs3o76ym6j.amplifyapp.com'; // 예: 'https://www.fopofo.com'
    // ----------------------------------------------------
    const fullUrl = `${DOMAIN}${portfolioPath}`;

    useEffect(() => {
        if (location.state && location.state.portfolioUrl) {
            setPortfolioPath(location.state.portfolioUrl);
        } else {
            console.error("포트폴리오 URL이 전달되지 않았습니다.");
            alert("잘못된 접근입니다. 메인 페이지로 이동합니다.");
            navigate('/mainpage');
        }
    }, [location.state, navigate]);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setShowElements(true);
                    return 100;
                }
                return prev + 1;
            });
        }, 30); // 로딩 속도를 약간 빠르게 조절
        return () => clearInterval(interval);
    }, []);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(fullUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            alert('복사에 실패했어요 😢');
        }
    };

    // ✅ 3. QR 코드를 다운로드하는 기능을 새로 추가합니다.
    const handleDownloadQR = () => {
        if (qrCodeRef.current === null) {
            return;
        }
        toPng(qrCodeRef.current, { cacheBust: true })
            .then((dataUrl) => {
                const link = document.createElement('a');
                link.download = 'my-portfolio-qr.png';
                link.href = dataUrl;
                link.click();
            })
            .catch((err) => {
                console.error('QR 코드 다운로드 실패:', err);
                alert('QR 코드 생성에 실패했습니다.');
            });
    };

    const handleLogout = () => {
        logout();
        navigate('/mainpage');
    };

    // ✅ 4. 새로운 디자인의 JSX 구조를 적용하고 모든 기능을 연결합니다.
    return (
        <div className="url-page-wrapper">
            <img
                src="/Fopofo-Logo-v2.png"
                alt="fopofo-logo"
                className="nav-logo"
                onClick={() => navigate('/mainpage')}
            />
            <div className="noportfolio-top-buttons">
                <button className="outline-btn" onClick={handleLogout}>logout</button>
                <button className="outline-btn" onClick={() => navigate('/home')}>Exit</button>
            </div>
            
            <div
                className={`final-banner ${showElements ? 'hoverable' : ''}`}
                onClick={() => { if (showElements) { window.open(fullUrl, '_blank'); } }}
            >
                <div className="url-title-box animate-3d">
                    <h1>PORTFOLIO<br />IS CREATED</h1>
                </div>
            </div>

            <div className="url-box-custom animate-3d">
                <div className="url-label">URL</div>
                <div className="url-display">
                    {showElements ? (
                        <span>{fullUrl}</span>
                    ) : (
                        <span className="loading-placeholder">URL 생성 중...</span>
                    )}
                </div>
                <button
                    className="copy-button-custom"
                    onClick={handleCopy}
                    disabled={!showElements}
                >
                    복사
                </button>
            </div>

            {copied && <span className="copy-feedback">링크가 복사되었습니다!</span>}

            {!showElements ? (
                <>
                    <div className="progress-container animate-3d">
                        <div className="progress-bar" style={{ width: `${progress}%` }} />
                    </div>
                    <p className="loading-text">생성중...</p>
                </>
            ) : (
                <div className="qr-wrapper">
                    <div ref={qrCodeRef} style={{ background: 'white', padding: '16px', borderRadius: '8px' }}>
                        <QRCode value={fullUrl} size={128} />
                    </div>
                    <p className="qr-label">QR 코드로 접속해보세요</p>
                    <button className="outline-btn" style={{marginTop: '1rem'}} onClick={handleDownloadQR}>
                        QR 다운로드
                    </button>
                </div>
            )}
        </div>
    );
}

export default PortfolioCreatedPage;