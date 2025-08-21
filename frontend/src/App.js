// App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {  GlobalWorkerOptions } from "pdfjs-dist";

GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

// 메인/인증
import StartPage from "./pages/StartPage/StartPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import SignupPage from "./pages/SignupPage/SignupPage";
import HomePage from "./pages/HomePage/HomePage";
import CreateUser from "./pages/CreateUser/CreateUser";

// 마이페이지
import MypageIntroSection from "./pages/mypage/MypageIntroSection";
import IntroEditPage from "./pages/mypage/IntroEditPage";
import PortfolioEditPage from "./pages/mypage/PortfolioEditPage";
import ChatbotEditPage from "./pages/mypage/ChatbotEditPage";

// 포트폴리오 생성 과정
import PortfolioCreatedPage from "./pages/PortfolioCreatedPage/PortfolioCreatedPage";
import PortfolioUploadPage from "./pages/PortfolioUploadPage/PortfolioUploadPage";
import IntroUploadPage from "./pages/IntroUploadPage/IntroUploadPage";

// 챗봇 생성 과정
import ChatbotFileUpload from './pages/ChatbotFileUpload/ChatbotFileUpload';
import ChatbotPromptPage from './pages/ChatbotPromptPage/ChatbotPromptPage';

// 공유용 페이지 & 안내 페이지
import PublicPortfolioPage from './components/PublicPortfolioPage/PublicPortfolioPage';
import NoPortfolioPage from './pages/NoPortfolioPage/NoPortfolioPage';

// 기타
import { AuthProvider } from './contexts/AuthContext';
import './index.css';




function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* 시작/로그인/회원가입 */}
          <Route path="/" element={<StartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/mainpage" element={<StartPage />} />

          {/* 튜토리얼 (로그인 후) */}
          <Route path="/home" element={<HomePage />} />
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
          
          {/* 공유용 페이지 & 안내 */}
          <Route path="/portfolio/:userId" element={<PublicPortfolioPage />} />
          <Route path="/no-portfolio" element={<NoPortfolioPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;