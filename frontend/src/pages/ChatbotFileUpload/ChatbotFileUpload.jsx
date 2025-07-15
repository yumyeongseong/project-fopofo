// src/pages/ChatbotFileUpload/ChatbotFileUpload.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ChatbotFileUpload.css';

const ChatbotFileUpload = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate('/prompt/chatbot');
  };

  const goHome = () => {
    navigate('/');
  };

  const goToMyPage = () => {
    navigate('/mypage');
  };

  return (
    <div className="upload-container">
      <header className="upload-header">
        {/* ✅ 로고 (좌측 상단) */}
        <img
          src="/images/logo.png"
          alt="포포포 로고"
          className="logo"
          onClick={goHome}
          style={{ cursor: 'pointer' }}
        />

        {/* ✅ 마이페이지 버튼 (우측 상단) */}
        <div
          className="mypage"
          onClick={goToMyPage}
          style={{ cursor: 'pointer' }}
        >
          my page
        </div>
      </header>

      <h2 className="title">Upload files for Chatbot</h2>

      <div className="upload-box">
        <p className="instruction">
          자기소개서 및 이력서를 업로드해주세요.
          <br />
          <span className="subtext">
            (특이사항 및 강조하고 싶은 내용을 업로드 시<br />
            특정경험에 대하여 자세하게 답변 받을 수 있습니다.)
          </span>
        </p>
        <input type="file" className="file-input" />
        <button className="next-button" onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
};

export default ChatbotFileUpload;
