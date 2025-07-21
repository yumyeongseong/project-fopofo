import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

// 공통/인증
import StartPage from './pages/StartPage/StartPage';
import LoginPage from './pages/LoginPage/LoginPage';
import SignupPage from './pages/SignupPage/SignupPage';
import HomePage from './pages/HomePage/HomePage';
import CreateUser from './pages/CreateUser';

// 포트폴리오 생성 흐름
import PortfolioUploadPage from './pages/PortfolioUploadPage/PortfolioUploadPage';
import PortfolioCreatedPage from './pages/PortfolioCreatedPage/PortfolioCreatedPage';
import IntroUploadPage from './pages/IntroUploadPage';
import ChatbotFileUpload from './pages/ChatbotFileUpload/ChatbotFileUpload';
import ChatbotPromptPage from './pages/ChatbotPromptPage/ChatbotPromptPage';

// 마이페이지
import MypageIntroSection from './pages/mypage/MypageIntroSection';
import IntroEditPage from './pages/mypage/IntroEditPage';
import PortfolioEditPage from './pages/mypage/PortfolioEditPage';
import ChatbotEditPage from './pages/mypage/ChatbotEditPage';

// 사용자용 웹
import UserPage from './pages/UserPage/UserPage';
import UserMainPage from './components/UserMainPage';

// AuthContext
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* 공통 */}
          <Route path="/" element={<StartPage />} />
          <Route path="/mainpage" element={<StartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/create" element={<CreateUser />} />

          {/* 포트폴리오 생성 흐름 */}
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

          {/* 사용자 공개 페이지 */}
          <Route path="/user/:userName" element={<UserMainPage />} />
          <Route path="/user/:userId" element={<UserPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
