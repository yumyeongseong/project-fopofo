import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import StartPage from './pages/StartPage/StartPage';
import LoginPage from './pages/LoginPage/LoginPage';
import SignupPage from './pages/SignupPage/SignupPage';
import HomePage from './pages/HomePage/HomePage';
import PortfolioUploadPage from './pages/PortfolioUploadPage/PortfolioUploadPage';
import ChatbotFileUpload from './pages/ChatbotFileUpload/ChatbotFileUpload';
import ChatbotPromptPage from './pages/ChatbotPromptPage/ChatbotPromptPage';
import PortfolioCreatedPage from './pages/PortfolioCreatedPage/PortfolioCreatedPage';

// 👇 1. 우리가 보여줘야 할 UserPage 컴포넌트를 import 합니다.
import UserPage from './pages/UserPage/UserPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/mainpage" element={<StartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/upload" element={<PortfolioUploadPage />} />
        <Route path="/upload/chatbot" element={<ChatbotFileUpload />} />
        <Route path="/prompt/chatbot" element={<ChatbotPromptPage />} />
        <Route path="/portfolio-created" element={<PortfolioCreatedPage />} />

        {/* 👇 2. '/user/사용자ID' 형태의 주소를 처리할 라우트를 여기에 추가합니다. */}
        {/* ':userId'는 'test1'이나 'gemini'처럼 동적으로 변하는 값을 의미합니다. */}
        <Route path="/user/:userId" element={<UserPage />} />

      </Routes>
    </Router>
  );
}

export default App;