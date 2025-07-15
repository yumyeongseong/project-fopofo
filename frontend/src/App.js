import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StartPage from './pages/StartPage'
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import PortfolioUploadPage from './pages/PortfolioUploadPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/mainpage" element={<StartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/upload" element={<PortfolioUploadPage />} />
      </Routes>
    </Router>
  );
}

export default App;
