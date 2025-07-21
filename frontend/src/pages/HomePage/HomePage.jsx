import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();
  const [serverMessage, setServerMessage] = useState(''); // 💬 서버 메시지 상태

  const handleMyPageClick = () => {
    navigate('/mypage');
  };

  const handleConnect = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8011');
      const data = await res.json();
      setServerMessage(data.message);
    } catch (err) {
      console.error("백엔드 연결 실패", err);
      setServerMessage("❌ 백엔드 연결 실패");
    }
  };

  return (
    <div className="home-container">
      <img
        src="/images/fopofo-logo.png" // ✅ 지현 디자인 반영
        alt="fopofo-logo"
        className="home-logo"
        onClick={() => navigate('/mainpage')}
      />

      <header className="home-header">
        <button className="mypage-button-home" onClick={handleMyPageClick}>
          my page
        </button>
      </header>

      <main className="home-main">
        <div className="main-title-box">
          <div
            className="create-button"
            onClick={() => navigate('/create')}
          >
            Create Your Own Web Portfolio
          </div>
        </div>

        {/* ✅ 백엔드 연결 테스트 버튼 */}
        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <button onClick={handleConnect}>📡 백엔드 연결 테스트</button>
          <p>{serverMessage}</p>
        </div>
      </main>
    </div>
  );
}

export default HomePage;
