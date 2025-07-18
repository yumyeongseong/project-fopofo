import React, { useState, useEffect } from 'react';
// ✅ useNavigate를 import하여 페이지 이동 기능을 사용합니다.
import { useLocation, useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import './PortfolioCreatedPage.css';

function PortfolioCreatedPage() {
    const location = useLocation();
    const navigate = useNavigate(); // ✅ 페이지 이동을 위한 함수
    const [portfolioUrl, setPortfolioUrl] = useState('');

    useEffect(() => {
        // 페이지로 전달된 portfolioUrl이 있는지 확인합니다.
        if (location.state && location.state.portfolioUrl) {
            setPortfolioUrl(location.state.portfolioUrl);
        } else {
            // URL이 없는 비정상적인 접근일 경우 예외 처리
            console.error("포트폴리오 URL이 전달되지 않았습니다.");
            alert("잘못된 접근입니다. 메인 페이지로 이동합니다.");
            navigate('/mainpage'); // 메인 페이지로 리디렉션
        }
    }, [location.state, navigate]);

    const handleDownloadQR = () => {
        const svg = document.getElementById("PortfolioQRCode");
        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.download = "portfolio-qr-code.png";
            downloadLink.href = pngFile;
            downloadLink.click();
        };
        img.src = "data:image/svg+xml;base64," + btoa(svgData);
    };

    // ✅ '내 포트폴리오 보러가기' 버튼 클릭 시 실행될 함수를 새로 추가합니다.
    const goToMyPortfolio = () => {
        if (portfolioUrl) {
            try {
                // portfolioUrl (예: http://localhost:3000/user/fofo123) 에서
                // 경로 부분(pathname)인 '/user/fofo123'만 추출하여 이동합니다.
                const path = new URL(portfolioUrl).pathname;
                navigate(path);
            } catch (error) {
                console.error("URL 경로 추출 실패:", error);
                alert("페이지 이동에 실패했습니다.");
            }
        }
    };

    // 👇 이 아래의 JSX 부분은 기존 구조를 유지하되, 버튼 하나만 추가됩니다.
    return (
        <div className="created-container">
            <h1 className="created-title">Portfolio Created!</h1>
            <p className="created-subtitle">
                당신의 포트폴리오가 성공적으로 생성되었습니다.
                <br />
                아래 QR코드를 통해 다른 사람에게 공유해보세요!
            </p>
            <div className="qr-code-box">
                {portfolioUrl ? (
                    <QRCode id="PortfolioQRCode" value={portfolioUrl} size={256} />
                ) : (
                    <p>QR 코드를 생성하는 중입니다...</p>
                )}
            </div>
            <div className="button-group">
                <button className="download-button" onClick={handleDownloadQR}>
                    QR 코드 다운로드
                </button>
                {/* ✅ --- '내 포트폴리오 보러가기' 버튼을 새로 추가합니다. --- */}
                <button className="view-portfolio-button" onClick={goToMyPortfolio}>
                    내 포트폴리오 보러가기
                </button>
                {/* ✅ --- 여기까지 추가 --- */}
            </div>
        </div>
    );
}

export default PortfolioCreatedPage;