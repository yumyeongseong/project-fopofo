<<<<<<< HEAD
// src/pages/PortfolioUploadPage/PortfolioUploadPage.jsx
import React from 'react';
=======
import React, { useState } from 'react';
>>>>>>> 48898a822c8a79aad1384cf59fd36da00566d2af
import { useNavigate } from 'react-router-dom';
import './PortfolioUploadPage.css';

function PortfolioUploadPage() {
<<<<<<< HEAD
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/mainpage'); // 로고 클릭 시 시작화면으로 이동
  };

  const handleNextClick = () => {
    // ✅ 기본 이동 기능 추가
    navigate('/upload/chatbot');
  };

  return (
    <div className="upload-container">
      <header className="upload-header">
        <img
          src="/images/fopofo-logo.png"
          alt="logo"
          className="upload-logo"
          onClick={handleLogoClick}
        />
        <button className="mypage-button">my page</button>
      </header>

      <main className="upload-main">
        <h1 className="upload-title">Upload files for Portfolio</h1>
        <div className="upload-content-wrapper">
          <div className="upload-box">
            <input type="file" className="file-input" />
            <p className="file-tip">
              *파일명은 각 작품에 해당하는 작품명에 반영됩니다.
            </p>
          </div>

          <div className="preview-box">
            <div className="preview">PREVIEW</div>
          </div>
        </div>
      </main>

      <footer className="upload-footer">
        <button className="next-button" onClick={handleNextClick}>
          Next
        </button>
      </footer>
    </div>
  );
}

export default PortfolioUploadPage;
=======
    const navigate = useNavigate();

    // ✅ 파일 업로드 상태 관리
    const [uploadedFiles, setUploadedFiles] = useState({
        Design: [],
        Video: [],
        Document: [],
        Photo: [],
    });

    const handleLogoClick = () => {
        navigate('/mainpage');
    };

    const handleFileDelete = (category, indexToRemove) => {
        setUploadedFiles((prev) => ({
            ...prev,
            [category]: prev[category].filter((_, i) => i !== indexToRemove),
        }));
    };

    // ✅ 🔁 수정된 부분: Next 클릭 시 다음 페이지로 이동
    const handleNextClick = () => {
        navigate('/chatbotfileupload'); // ✅ 팀원이 만든 Chatbot 페이지로 이동
    };

    // ✅ 파일 선택 핸들러
    const handleFileChange = (e, category) => {
        const newFiles = Array.from(e.target.files);

        setUploadedFiles((prev) => ({
            ...prev,
            [category]: [...prev[category], ...newFiles], // ✅ 기존 배열에 누적 추가
        }));

        e.target.value = ''; // ✅ 같은 파일 재선택 시에도 반응하도록 초기화
    };

    return (
        <div className="upload-container">
            <header className="upload-header">
                <img
                    src="/fopofo-logo.png"
                    alt="logo"
                    className="upload-logo"
                    onClick={handleLogoClick}
                />
                <button className="mypage-button-upload">my page</button>
            </header>

            <main className="upload-main">
                <h1 className="upload-title">Upload files for Portfolio</h1>

                <div className="upload-grid">
                    {['Design', 'Video', 'Document', 'Photo'].map((category) => (
                        <div className="upload-card" key={category}>
                            <div className="upload-label">{category}</div>
                            <input
                                type="file"
                                className="file-input"
                                multiple
                                onChange={(e) => handleFileChange(e, category)}
                            />
                            <ul className="file-list">
                                {uploadedFiles[category].map((file, index) => (
                                    <li key={index}>
                                        {file.name}
                                        <button
                                            className="delete-button"
                                            onClick={() => handleFileDelete(category, index)}
                                        >
                                            &minus;
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <p className="file-tip">
                    *파일명은 각 작품에 해당하는 작품명에 반영됩니다.
                </p>
            </main>

            <footer className="upload-footer">
                <button className="next-button" onClick={handleNextClick}>
                    Next
                </button>
            </footer>
        </div>
    );
}

export default PortfolioUploadPage;
>>>>>>> 48898a822c8a79aad1384cf59fd36da00566d2af
