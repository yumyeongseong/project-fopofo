import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StartPage from './pages/StartPage/StartPage';
import LoginPage from './pages/LoginPage/LoginPage';
import SignupPage from './pages/SignupPage/SignupPage';
import HomePage from './pages/HomePage/HomePage';
import PortfolioUploadPage from './pages/PortfolioUploadPage/PortfolioUploadPage';
import PortfolioCreatedPage from './pages/PortfolioCreatedPage/PortfolioCreatedPage';
import UserPage from './pages/UserPage'; // ✅ 요기만 수정!
import './index.css';

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
        <Route path="/test-url" element={<PortfolioCreatedPage />} />
        <Route path="/user/:id" element={<UserPage />} />
      </Routes>
    </Router>
  );
}

export default App;
