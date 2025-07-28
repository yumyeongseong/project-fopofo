// ✅ ChatbotFileUpload.jsx (IntroUpload 스타일 동일하게 구조/함수명 리팩토링)

import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChatbotFileUpload.css';
import axios from 'axios';

function ChatbotFileUpload() {
  const [chatbotFiles, setChatbotFiles] = useState([]);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        handleChatbotNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [chatbotFiles]);

  const handleChatbotFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const nonPdf = selectedFiles.find(file => !file.name.endsWith('.pdf'));
    if (nonPdf) return alert('PDF 파일만 업로드 가능합니다.');
    setChatbotFiles((prev) => [...prev, ...selectedFiles]);
  };

  const handleChatbotDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    const nonPdf = droppedFiles.find(file => !file.name.endsWith('.pdf'));
    if (nonPdf) return alert('PDF 파일만 업로드 가능합니다.');
    setChatbotFiles((prev) => [...prev, ...droppedFiles]);
  };

  const handleChatbotDelete = (index) => {
    setChatbotFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChatbotNext = async () => {
    if (chatbotFiles.length === 0) {
      alert('파일을 하나 이상 업로드해주세요.');
      return;
    }

    const formData = new FormData();
    chatbotFiles.forEach(file => formData.append('chatbotDocs', file));

    try {
      await axios.post('/api/upload/chatbot', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('업로드 완료!');
      navigate('/prompt/chatbot');
    } catch (err) {
      console.error(err);
      alert('업로드 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="homepage-container" onDragOver={(e) => e.preventDefault()} onDrop={handleChatbotDrop}>
      <img
        src="/images/fopofo-logo.png"
        alt="logo"
        className="nav-logo"
        onClick={() => navigate('/')}
      />

      <div className="noportfolio-top-buttons">
        <button className="outline-btn" onClick={() => navigate('/')}>logout</button>
        <button className="outline-btn" onClick={() => navigate('/home')}>Exit</button>
      </div>

      <div className="intro-upload-container ">
        <h1 className="intro-upload-title animate-3d">
          Upload documents for your chatbot
        </h1>

        <p className="intro-upload-subtitle animate-3d">
          챗봇이 대답에 참고할 자기소개서 및 이력서를 업로드해주세요.
        </p>

        <div className="intro-upload-box animate-3d">
          <label htmlFor="chatbot-file-upload" className="intro-upload-label">
            파일 선택 (PDF만 가능)
          </label>
          <input
            type="file"
            id="chatbot-file-upload"
            accept="application/pdf"
            multiple
            onChange={handleChatbotFileChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />

          <div className="intro-file-list">
            {chatbotFiles.map((file, index) => (
              <div key={index} className="intro-file-item animate-fade-in">
                {file.name}
                <button className="intro-delete-btn" onClick={() => handleChatbotDelete(index)}>×</button>
              </div>
            ))}
          </div>

          <button className="intro-next-btn" onClick={handleChatbotNext}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatbotFileUpload;
