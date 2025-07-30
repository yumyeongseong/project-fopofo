import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

// ✅ [기능] 전체 앱에 인증 상태를 제공하는 AuthProvider를 가져옵니다.
import { AuthProvider } from './contexts/AuthContext';

// --- 페이지 컴포넌트 임포트 ---
// 공통 및 인증
import StartPage from './pages/StartPage/StartPage';
import LoginPage from './pages/LoginPage/LoginPage';
import SignupPage from './pages/SignupPage/SignupPage';
import HomePage from './pages/HomePage/HomePage';
import CreateUser from './pages/CreateUser/CreateUser';

// 포트폴리오 제작 과정
import IntroUploadPage from './pages/IntroUploadPage/IntroUploadPage';
import PortfolioUploadPage from './pages/PortfolioUploadPage/PortfolioUploadPage';
import ChatbotFileUpload from './pages/ChatbotFileUpload/ChatbotFileUpload';
import ChatbotPromptPage from './pages/ChatbotPromptPage/ChatbotPromptPage';
import PortfolioCreatedPage from './pages/PortfolioCreatedPage/PortfolioCreatedPage';

// 마이페이지
import MypageIntroSection from './pages/mypage/MypageIntroSection';
import IntroEditPage from './pages/mypage/IntroEditPage';
import PortfolioEditPage from './pages/mypage/PortfolioEditPage';
import ChatbotEditPage from './pages/mypage/ChatbotEditPage';

// 사용자 공개용 페이지
import UserPage from './pages/UserPage/UserPage';
import PublicPortfolioPage from './pages/PublicPortfolioPage';
import NoPortfolioPage from './pages/NoPortfolioPage/NoPortfolioPage';

function App() {
  return (
    // ✅ [기능] 앱 전체를 AuthProvider로 감싸서 로그인 상태를 공유합니다.
    <AuthProvider>
      <Router>
        <Routes>
          {/* --- 모든 페이지 경로를 여기에 통합합니다 --- */}

          {/* 공통 및 인증 */}
          <Route path="/" element={<StartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/home" element={<HomePage />} />

          {/* 포트폴리오 생성 흐름 */}
          <Route path="/create" element={<CreateUser />} />
          <Route path="/intro-upload" element={<IntroUploadPage />} />
          <Route path="/upload" element={<PortfolioUploadPage />} />
          <Route path="/upload/chatbot" element={<ChatbotFileUpload />} />
          <Route path="/prompt/chatbot" element={<ChatbotPromptPage />} />
          <Route path="/portfolio-created" element={<PortfolioCreatedPage />} />

          {/* 마이페이지 */}
          <Route path="/mypage" element={<MypageIntroSection />} />
          <Route path="/mypage/intro" element={<IntroEditPage />} />
          <Route path="/mypage/portfolio" element={<PortfolioEditPage />} />
          <Route path="/mypage/chatbot" element={<ChatbotEditPage />} />

          {/* 사용자 공개용 포트폴리오 페이지 */}
          <Route path="/user/:userId" element={<UserPage />} />
          <Route path="/portfolio/:userId" element={<PublicPortfolioPage />} />

          {/* ✅ [신규 UI] 디자이너가 추가한 '포트폴리오 없음' 안내 페이지 */}
          <Route path="/no-portfolio" element={<NoPortfolioPage />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;