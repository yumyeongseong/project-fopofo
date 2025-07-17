import React from 'react';
import './StartPage.css';
import { useNavigate } from 'react-router-dom';

function StartPage() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/login');
    };

    return (
        <div className="start-page">
            {/* 왼쪽 상단 로고 */}
            <img
                src="/fopofo-logo.png"
                alt="fopofo-logo"
                className="logo"
                onClick={() => navigate('/mainpage')}
            />

            {/* 배경 이미지들 */}
            <div className="background-images">
                <img src="/cut2.png" alt="cut2" className="img img1" />
                <img src="/cut2-2.png" alt="cut2-2" className="img img2" />
                <img src="/cut3-1.png" alt="cut3-1" className="img img3" />
                <img src="/cut3-3.png" alt="cut3" className="img img4" />
                <img src="/cut7.png" alt="cut7" className="img img5" />
            </div>

            {/* 메인 타이틀 */}
            <h1 className="start-title" onClick={handleClick}>
                For Portfolio For People
            </h1>
        </div>
    );
}

export default StartPage;