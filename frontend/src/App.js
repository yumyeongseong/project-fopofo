import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 👇 1. 두 버전에 있던 모든 페이지 컴포넌트를 import 합니다.
import StartPage from './pages/StartPage/StartPage';
import LoginPage from './pages/LoginPage/LoginPage';
import SignupPage from './pages/SignupPage/SignupPage';
import HomePage from './pages/HomePage/HomePage';
import PortfolioUploadPage from './pages/PortfolioUploadPage/PortfolioUploadPage';
import PortfolioCreatedPage from './pages/PortfolioCreatedPage/PortfolioCreatedPage';
import ChatbotFileUpload from './pages/ChatbotFileUpload/ChatbotFileUpload';
import ChatbotPromptPage from './pages/ChatbotPromptPage/ChatbotPromptPage';
import UserPage from './pages/UserPage/UserPage';
// 👇 2. 팀원 버전에 있던 CreateUser 페이지를 추가로 import 합니다.
import CreateUser from "./pages/CreateUser";
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* --- 공통 라우트 --- */}
        <Route path="/" element={<StartPage />} />
        <Route path="/mainpage" element={<StartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/home" element={<HomePage />} />

        {/* --- 포트폴리오 생성 흐름 라우트 --- */}

        {/* 👇 3. 팀원의 '/create' 라우트를 추가하여 새로운 흐름을 완성합니다. */}
        <Route path="/create" element={<CreateUser />} />

        {/* 기존 포트폴리오 생성 흐름은 그대로 유지됩니다. */}
        <Route path="/upload" element={<PortfolioUploadPage />} />
        <Route path="/upload/chatbot" element={<ChatbotFileUpload />} />
        <Route path="/prompt/chatbot" element={<ChatbotPromptPage />} />
        <Route path="/portfolio-created" element={<PortfolioCreatedPage />} />

        {/* --- 최종 사용자 페이지 라우트 --- */}

        {/* 👇 4. URL 파라미터를 ':userId'로 통일하여 일관성을 유지합니다. */}
        <Route path="/user/:userId" element={<UserPage />} />
      </Routes>
    </Router>
  );
}

export default App;