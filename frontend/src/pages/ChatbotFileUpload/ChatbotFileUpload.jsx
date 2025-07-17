// src/pages/ChatbotFileUpload/ChatbotFileUpload.jsx
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChatbotFileUpload.css';
import axios from 'axios'; // ✅ axios 임포트 추가

const ChatbotFileUpload = () => {
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  // 파일 추가 로직 (재사용을 위해 useCallback 사용)
  const addFiles = useCallback((newFiles) => {
    const filesArray = Array.from(newFiles);
    setSelectedFiles(prevFiles => {
      const uniqueFiles = filesArray.filter(
        (newFile) => !prevFiles.some((prevFile) => prevFile.name === newFile.name && prevFile.size === newFile.size)
      );
      return [...prevFiles, ...uniqueFiles];
    });
  }, [selectedFiles]); // ✅ 수정된 부분: selectedFiles를 의존성 배열에 추가하여 최신 상태 반영

  // input type="file" 변경 핸들러
  const handleFileChange = (e) => {
    addFiles(e.target.files);
  };

  // 드래그앤드롭 이벤트 핸들러
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

  // 파일 삭제 핸들러
  const handleRemoveFile = (fileName) => {
    setSelectedFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
  };

  // 파일 프리뷰 렌더링 함수 (자기소개서/이력서이므로 아이콘/파일명 위주)
  const renderFilePreview = (file) => {
    const fileName = file.name;
    const fileExtension = fileName.split('.').pop().toLowerCase();
    let icon = '📄'; // 기본 문서 아이콘

    if (fileExtension === 'pdf') {
      icon = '📄';
    } else if (fileExtension === 'docx' || fileExtension === 'doc') {
      icon = '📝';
    } else if (fileExtension === 'txt') {
      icon = '📃';
    }

    return (
      <div className="file-preview-item">
        <span className="file-icon">{icon}</span>
        <span className="file-name">{fileName}</span>
      </div>
    );
  };

  // ✅ 수정된 부분: 백엔드로 파일 전송 로직
  const handleUploadFiles = async () => {
    if (selectedFiles.length === 0) {
      alert('자기소개서 및 이력서 파일을 업로드해주세요.');
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('file', file); // 'file'은 백엔드 FastAPI의 @app.post("/upload")의 파라미터 이름과 일치해야 함
    });

    try {
      // ✅ JWT 토큰을 Authorization 헤더에 포함하여 요청
      const token = localStorage.getItem('token'); // 로그인 시 저장된 토큰
      if (!token) {
        alert('로그인이 필요합니다.');
        navigate('/login');
        return;
      }

      // FastAPI 백엔드 URL: http://localhost:8000
      const response = await axios.post('http://localhost:8000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // 파일 업로드 시 필수
          'Authorization': `Bearer ${token}` // JWT 토큰 첨부
        }
      });

      console.log('파일 업로드 및 벡터 저장 완료:', response.data);
      alert('파일 업로드 및 챗봇 학습 준비 완료!');
      setSelectedFiles([]); // 업로드 후 파일 목록 초기화
      navigate('/prompt/chatbot'); // 다음 프롬프트 페이지로 이동
    } catch (error) {
      console.error('파일 업로드 실패:', error.response?.data || error.message);
      alert('파일 업로드에 실패했습니다. 다시 시도해주세요.');
      if (error.response?.data) {
        console.error('FastAPI Error Detail:', error.response.data.detail);
      }
    }
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

      {/* 드래그앤드롭 영역 및 파일 선택 input */}
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

        {/* 파일 선택 버튼 (기존 input을 숨기고 label로 클릭 유도) */}
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

        {/* 선택된 파일 목록 표시 */}
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

        <button className="next-button" onClick={handleUploadFiles}> {/* ✅ 수정된 부분: handleNext 대신 handleUploadFiles 호출 */}
          Next
        </button>
      </div>
    </div>
  );
};

export default ChatbotFileUpload;