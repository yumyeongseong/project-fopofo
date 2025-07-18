// src/pages/ChatbotFileUpload/ChatbotFileUpload.jsx
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChatbotFileUpload.css';
// 👇 1. 기존 axios 대신 새로 만든 pythonApi를 가져옵니다.
import { pythonApi } from '../../services/api';

const ChatbotFileUpload = () => {
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  // ... (파일 추가, 드래그앤드롭 관련 핸들러 함수들은 기존과 동일) ...
  const addFiles = useCallback((newFiles) => {
    const filesArray = Array.from(newFiles);
    setSelectedFiles(prevFiles => {
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
    setSelectedFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
  };

  // 👇 2. 파일 업로드 핸들러(handleUploadFiles)를 수정합니다.
  const handleUploadFiles = async () => {
    if (selectedFiles.length === 0) {
      alert('자기소개서 및 이력서 파일을 업로드해주세요.');
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('file', file);
    });

    try {
      // 이제 pythonApi를 사용하므로, 전체 주소 대신 '/upload'만 적어줍니다.
      const response = await pythonApi.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          // 'Authorization' 헤더는 api.js에서 자동으로 추가되므로 여기서 삭제합니다.
        }
      });

      console.log('파일 업로드 및 벡터 저장 완료:', response.data);
      alert('파일 업로드 및 챗봇 학습 준비 완료!');
      setSelectedFiles([]);
      navigate('/prompt/chatbot');
    } catch (error) {
      // 👇 에러 처리 시 토큰이 없는 경우를 더 명확하게 확인합니다.
      if (error.response?.status === 401) {
        alert('인증 정보가 유효하지 않습니다. 다시 로그인해주세요.');
        navigate('/login');
      } else {
        console.error('파일 업로드 실패:', error.response?.data || error.message);
        alert('파일 업로드에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  // ... (나머지 렌더링 부분은 기존과 동일합니다.) ...
  const goHome = () => {
    navigate('/');
  };

  const goToMyPage = () => {
    navigate('/mypage');
  };

  return (
    <div className="upload-container">
      <header className="upload-header">
        <img
          src="/images/fopofo-logo.png"
          alt="포포포 로고"
          className="upload-logo"
          onClick={goHome}
        />
        <button className="mypage-button" onClick={goToMyPage}>
          my page
        </button>
      </header>

      <h2 className="title">Upload files for Chatbot</h2>

      <div
        className={`upload-box ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <p className="instruction">
          자기소개서 및 이력서를 업로드해주세요.
          <br />
          <span className="subtext">
            (특이사항 및 강조하고 싶은 내용을 업로드 시<br />
            특이경험에 대하여 자세하게 답변 받을 수 있습니다.)
          </span>
        </p>

        <label htmlFor="file-upload" className="file-upload-label">
          파일 선택
        </label>
        <input
          id="file-upload"
          type="file"
          className="file-input"
          onChange={handleFileChange}
          multiple
          hidden
        />
        <span className="selected-files-text">
          {selectedFiles.length > 0 ? `${selectedFiles.length}개 파일 선택됨` : '선택된 파일 없음'}
        </span>

        {selectedFiles.length > 0 && (
          <ul className="file-list">
            {selectedFiles.map((file, index) => (
              <li key={index} className="file-item">
                {file.name}
                <button
                  type="button"
                  onClick={() => handleRemoveFile(file.name)}
                  className="remove-file-button"
                >
                  X
                </button>
              </li>
            ))}
          </ul>
        )}

        <button className="next-button" onClick={handleUploadFiles}>
          Next
        </button>
      </div>
    </div>
  );
};

export default ChatbotFileUpload;