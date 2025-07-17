import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import './PortfolioCreatedPage.css';

function PortfolioCreatedPage() {
    const [copied, setCopied] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showQR, setShowQR] = useState(false);
    const [isCreated, setIsCreated] = useState(false); // ✅ useState는 함수 내부에 작성해야 함

    const portfolioUrl = 'https://forportfolioforpeople.com/your-id';

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
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setShowQR(true);
                    setIsCreated(true); // ✅ 생성 완료 시점!
                    return 100;
                }
                return prev + 1;
            });
        }, 50);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="url-page-wrapper">
            <img
                src="/fopofo-logo.png"
                alt="fopofo-logo"
                className="logo"
                onClick={() => window.location.href = '/mainpage'}
            />

            {/* ✅ 웹 생성 완료된 후에만 마우스 효과 및 이동 */}
            <div
                className={`final-banner ${isCreated ? 'hoverable' : ''}`}
                onClick={() => {
                    if (isCreated) {
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
                    <QRCode value={portfolioUrl} size={100} />
                    <p className="qr-label">QR 코드로 접속해보세요</p>
                </div>
            )}
        </div>
    );
}

export default PortfolioCreatedPage;