import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import StartPage from './pages/StartPage/StartPage';
import LoginPage from './pages/LoginPage/LoginPage';
import SignupPage from './pages/SignupPage/SignupPage';
import HomePage from './pages/HomePage/HomePage';
import PortfolioUploadPage from './pages/PortfolioUploadPage/PortfolioUploadPage';
import ChatbotFileUpload from './pages/ChatbotFileUpload/ChatbotFileUpload';
import ChatbotPromptPage from './pages/ChatbotPromptPage/ChatbotPromptPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ 이 줄이 반드시 있어야 기본 경로에서 화면이 보입니다 */}
        <Route path="/" element={<StartPage />} />

        <Route path="/mainpage" element={<StartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/upload" element={<PortfolioUploadPage />} />
        <Route path="/upload/chatbot" element={<ChatbotFileUpload />} />
        <Route path="/prompt/chatbot" element={<ChatbotPromptPage />} />
      </Routes>
    </Router>
  );
}

export default App;
