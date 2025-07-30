import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChatbotFileUpload.css';
import { pythonApi } from '../../services/api';

const ChatbotFileUpload = () => {
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const addFiles = useCallback((newFiles) => {
    const filesArray = Array.from(newFiles);
    setSelectedFiles((prevFiles) => {
      const uniqueFiles = filesArray.filter(
        (newFile) => !prevFiles.some((prevFile) => prevFile.name === newFile.name && prevFile.size === newFile.size)
      );
      return [...prevFiles, ...uniqueFiles];
    });
  }, []);

  const handleFileChange = (e) => {
    addFiles(e.target.files);
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  }, [addFiles]);

  const handleRemoveFile = (fileName) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  const handleUploadFiles = async () => {
    if (selectedFiles.length === 0) {
      alert('자기소개서 및 이력서 파일을 업로드해주세요.');
      return;
    }
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append('file', file);
    });
    try {
      await pythonApi.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('파일 업로드 및 챗봇 학습 준비 완료!');
      navigate('/prompt/chatbot');
    } catch (error) {
      alert(error.response?.data?.detail || '파일 업로드에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="homepage-container" onDragOver={handleDragOver} onDrop={handleDrop} onDragLeave={handleDragLeave}>
      <img
        src="/images/fopofo-logo.png"
        alt="logo"
        className="nav-logo"
        onClick={() => navigate('/home')}
      />
      {/* [수정] 'my page' 버튼을 'logout'과 'Exit' 버튼으로 교체 */}
      <div className="noportfolio-top-buttons">
        <button className="outline-btn" onClick={() => {
          // TODO: 실제 로그아웃 로직 구현 필요
          alert("로그아웃 되었습니다.");
          navigate("/login");
        }}>logout</button>
        <button className="outline-btn" onClick={() => navigate("/")}>Exit</button>
      </div>

      <div className="intro-upload-container">
        <h1 className="intro-upload-title animate-3d">
          Upload documents for your chatbot
        </h1>
        <p className="intro-upload-subtitle animate-3d">
          챗봇이 대답에 참고할 자기소개서 및 이력서를 업로드해주세요.
        </p>
        <div className={`intro-upload-box animate-3d ${isDragging ? 'dragging' : ''}`}>
          <label htmlFor="chatbot-file-upload" className="intro-upload-label">
            파일 선택 (PDF, DOCX, TXT 가능)
          </label>
          <input
            type="file"
            id="chatbot-file-upload"
            accept=".pdf,.docx,.txt"
            multiple
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <div className="intro-file-list">
            {selectedFiles.length === 0 && <p className="no-files-text">여기에 파일을 드래그하세요</p>}
            {selectedFiles.map((file, index) => (
              <div key={index} className="intro-file-item animate-fade-in">
                <span>{file.name}</span>
                <button className="intro-delete-btn" onClick={() => handleRemoveFile(file.name)}>×</button>
              </div>
            ))}
          </div>
          <button className="intro-next-btn" onClick={handleUploadFiles}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotFileUpload;