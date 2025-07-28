// HomePage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  const goToPortfolio = () => {
    const hasPortfolio = true; // 백엔드 연동 시 수정
    if (hasPortfolio) {
      navigate('/user/your-id');
    } else {
      navigate('/no-portfolio');
    }
  };

  return (
    <div className="homepage-container">
      {/* 네비게이션 바 */}
      <header className="navbar">
        <div className="left-section">
          <img
            src="/images/fopofo-logo.png"
            alt="logo"
            className="nav-logo"
            onClick={() => navigate('/')}
          />
          <nav className="nav-links">
            <button className="nav-button" onClick={() => navigate('/home')}>home</button>
            <button className="nav-button" onClick={goToPortfolio}>portfolio</button>
            <button className="nav-button" onClick={() => navigate('/mypage')}>my page</button>
            <button className="nav-button" onClick={() => navigate('/')}>logout</button>
          </nav>
        </div>
        <button className="create-btn" onClick={() => navigate('/create')}>
          Create
        </button>
      </header>

      {/* 배너 제목 */}
      <h1 className="homepage-title">Create Your Own Web Portfolio</h1>

      {/* 설명 카드 4개 */}
      <section className="card-section">
        <div className="card">나만의 웹 커스터마이징!<br />
          사용자 설정 이름으로 시작화면이 자동 생성되고,<br />
          테마 색상·폰트·이미지까지 자유롭게 커스터마이징할 수 있어요.</div>
        <div className="card">한 눈에 딱 들어오는 나만의 자기소개서 웹페이지!<br />
          PDF나 파일 업로드만으로도 자동 생성! 간편한 링크 공유까지</div>
        <div className="card">이미지, 영상, 문서를 자유롭게 업로드하는 나만의 갤러리<br />
          카테고리 분류로 정돈된 포트폴리오를 모두에게!</div>
        <div className="card">챗봇 기반 이력서 Q/A 시스템<br />
          업로드한 자기소개서·이력서와
          웹에서 입력한 프롬프트 답변을 바탕으로,
          GPT 챗봇이 지원자의 강점과 경험을 분석하고 소개합니다.</div>
      </section>

      {/*  4분할 이미지 프리뷰 */}
      <section className="preview-grid">
        <div className="preview-item">
          <img src="/Start.png" alt="start" className="grid-img" />
          <p className="preview-label">웹 시작 화면</p>
        </div>
        <div className="preview-item">
          <img src="/myStart.png" alt="intro" className="grid-img" />
          <p className="preview-label">자기소개서 업로드 화면</p>
        </div>
        <div className="preview-item">
          <img src="/Portfolio.png" alt="portfolio" className="grid-img" />
          <p className="preview-label">포트폴리오 전시 화면</p>
        </div>
        <div className="preview-item">
          <img src="/Chatbot.png" alt="chatbot" className="grid-img" />
          <p className="preview-label">나만의 챗봇 화면</p>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
