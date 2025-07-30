import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './IntroUploadPage.css';

function IntroUploadPage() {
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Enter 키로 다음 페이지 이동
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [files]);

  // PDF만 업로드 허용
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const invalidFile = selectedFiles.find(
      (file) => !file.name.toLowerCase().endsWith('.pdf')
    );

    if (invalidFile) {
      alert('❌ PDF 파일만 업로드할 수 있습니다.');
      return;
    }

    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    const invalidFile = droppedFiles.find(
      (file) => !file.name.toLowerCase().endsWith('.pdf')
    );

    if (invalidFile) {
      alert('❌ PDF 파일만 업로드할 수 있습니다.');
      return;
    }

    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  const handleDelete = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Next 클릭 시 백엔드 업로드 요청
  const handleNext = async () => {
    if (files.length === 0) {
      alert('파일을 하나 이상 업로드해주세요.');
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    try {
      // 실제 백엔드 주소로 수정해줘야 함!
      await axios.post('http://localhost:5000/api/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // 업로드 성공 시 다음 페이지로 이동
      navigate('/upload');
    } catch (error) {
      console.error('업로드 실패:', error);
      alert('업로드 중 오류가 발생했습니다.');
    }
  };

  return (
    <div
      className="homepage-container"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
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

      <div className="intro-upload-container">
        <h1 className="intro-upload-title animate-3d">
          Upload your resume and cover letter
        </h1>

        <p className="intro-upload-subtitle animate-3d">
          자기소개서 및 이력서를 업로드해주세요.
        </p>

        <div className="intro-upload-box animate-3d">
          <label htmlFor="intro-file-upload" className="intro-upload-label">
            파일 선택 (PDF만 가능)
          </label>
          <input
            type="file"
            id="intro-file-upload"
            accept="application/pdf"
            multiple
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />

          <div className="intro-file-list">
            {files.map((file, index) => (
              <div key={index} className="intro-file-item animate-fade-in">
                {file.name}
                <button
                  className="intro-delete-btn"
                  onClick={() => handleDelete(index)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <button className="intro-next-btn" onClick={handleNext}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default IntroUploadPage;
