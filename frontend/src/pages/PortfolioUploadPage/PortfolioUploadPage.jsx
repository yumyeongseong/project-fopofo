import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PortfolioUploadPage.css';
import { nodeApi } from '../../services/api';

function PortfolioUploadPage() {
  const navigate = useNavigate();

  const [uploadedFiles, setUploadedFiles] = useState({
    Design: [],
    Video: [],
    Document: [],
    Photo: [],
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e, category) => {
    const newFiles = Array.from(e.target.files);
    if (newFiles.length === 0) return;

    setUploadedFiles((prev) => {
      const existingFiles = prev[category];
      const uniqueNewFiles = newFiles.filter(
        (newFile) => !existingFiles.some((existingFile) => existingFile.name === newFile.name)
      );
      return {
        ...prev,
        [category]: [...existingFiles, ...uniqueNewFiles],
      };
    });

    e.target.value = '';
  };

  const handleFileDelete = (category, index) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index),
    }));
  };

  const handleNextClick = async () => {
    setIsUploading(true);

    const allFiles = Object.entries(uploadedFiles).flatMap(([category, files]) =>
      files.map(file => ({ file, category }))
    );

    if (allFiles.length === 0) {
      alert("업로드할 파일이 없습니다. 다음 단계로 진행합니다.");
      navigate('/upload/chatbot');
      return;
    }

    const uploadPromises = allFiles.map(({ file, category }) => {
      const formData = new FormData();
      formData.append('file', file);
      return nodeApi.post(`/upload/${category.toLowerCase()}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    });

    try {
      await Promise.all(uploadPromises);
      alert("모든 파일이 성공적으로 업로드되었습니다!");
      navigate('/upload/chatbot');
    } catch (error) {
      console.error("파일 업로드 중 오류 발생:", error);
      alert("파일 업로드에 실패했습니다. 파일을 다시 확인해주세요.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogoClick = () => navigate('/');
  const handleMyPageClick = () => navigate('/mypage');

  return (
    <div className="upload-container">
      <header className="upload-header">
        <img src="/images/fopofo-logo.png" alt="logo" className="upload-logo" onClick={handleLogoClick} />
        <button className="mypage-button-upload" onClick={handleMyPageClick}>my page</button>
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
                    <button className="delete-button" onClick={() => handleFileDelete(category, index)}>
                      &minus;
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="file-tip">*파일명은 각 작품에 해당하는 작품명에 반영됩니다.</p>
      </main>
      <footer className="upload-footer">
        <button className="next-button" onClick={handleNextClick} disabled={isUploading}>
          {isUploading ? '업로드 중...' : 'Next'}
        </button>
      </footer>
    </div>
  );
}

export default PortfolioUploadPage;
