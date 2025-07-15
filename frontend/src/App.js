// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ChatbotFileUpload from './pages/ChatbotFileUpload/ChatbotFileUpload';
import ChatbotPromptPage from './pages/ChatbotPromptPage/ChatbotPromptPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/upload/chatbot" element={<ChatbotFileUpload />} />
        <Route path="/prompt/chatbot" element={<ChatbotPromptPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
