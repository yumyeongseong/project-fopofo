import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

// --- [병합] 양쪽 브랜치의 모든 페이지 컴포넌트를 import 합니다. ---
// 공통 및 인증
import StartPage from './pages/StartPage/StartPage';
import LoginPage from './pages/LoginPage/LoginPage';
import SignupPage from './pages/SignupPage/SignupPage';
import HomePage from './pages/HomePage/HomePage';
import CreateUser from "./pages/CreateUser";

// 마이페이지 (팀원의 새로운 기능)
import MypageIntroSection from "./pages/mypage/MypageIntroSection";
import IntroEditPage from "./pages/mypage/IntroEditPage";
import PortfolioEditPage from "./pages/mypage/PortfolioEditPage";
import ChatbotEditPage from "./pages/mypage/ChatbotEditPage";

// 포트폴리오 생성 및 챗봇
import PortfolioUploadPage from './pages/PortfolioUploadPage/PortfolioUploadPage';
import PortfolioCreatedPage from './pages/PortfolioCreatedPage/PortfolioCreatedPage';
import IntroUploadPage from "./pages/IntroUploadPage";
import ChatbotFileUpload from './pages/ChatbotFileUpload/ChatbotFileUpload';
import ChatbotPromptPage from './pages/ChatbotPromptPage/ChatbotPromptPage';

// 사용자 공개 페이지
import UserPage from './pages/UserPage/UserPage';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* === [병합] 양쪽의 모든 경로를 기능별로 정리하여 통합합니다. === */}

        {/* --- 공통 및 인증 라우트 --- */}
        <Route path="/" element={<StartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/home" element={<HomePage />} />

        {/* --- 포트폴리오 생성 흐름 라우트 --- */}
        <Route path="/create" element={<CreateUser />} />
        <Route path="/intro-upload" element={<IntroUploadPage />} />
        <Route path="/upload" element={<PortfolioUploadPage />} />
        <Route path="/upload/chatbot" element={<ChatbotFileUpload />} />
        <Route path="/prompt/chatbot" element={<ChatbotPromptPage />} />
        <Route path="/portfolio-created" element={<PortfolioCreatedPage />} />

        {/* --- 마이페이지 라우트 (새로운 기능) --- */}
        <Route path="/mypage" element={<MypageIntroSection />} />
        <Route path="/mypage/intro" element={<IntroEditPage />} />
        <Route path="/mypage/portfolio" element={<PortfolioEditPage />} />
        <Route path="/mypage/chatbot" element={<ChatbotEditPage />} />

        {/* --- 사용자 공개 페이지 라우트 --- */}
        <Route path="/user/:userId" element={<UserPage />} />
      </Routes>
    </Router>
  );
}