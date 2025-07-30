import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paintbrush, Video, FileText, Image as ImageIcon } from "lucide-react";
import './PortfolioUploadPage.css';
import { nodeApi } from '../../services/api';

const categoryConfig = {
  Design: { icon: <Paintbrush className="icon" />, accept: "image/jpeg, image/png" },
  Video: { icon: <Video className="icon" />, accept: "video/*" },
  Document: { icon: <FileText className="icon" />, accept: "application/pdf" },
  Photo: { icon: <ImageIcon className="icon" />, accept: "image/jpeg, image/png" },
};

export default function PortfolioUploadPage() {
  const navigate = useNavigate();
  const [filesByCategory, setFilesByCategory] = useState({ Design: [], Video: [], Document: [], Photo: [] });
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRefs = {
    Design: useRef(null), Video: useRef(null),
    Document: useRef(null), Photo: useRef(null),
  };

  const handleFileChange = (e, category) => {
    const newFiles = Array.from(e.target.files);
    setFilesByCategory(prev => ({
      ...prev,
      [category]: [...prev[category], ...newFiles]
    }));
  };

  const handleDelete = (category, fileToDelete) => {
    setFilesByCategory(prev => ({
      ...prev,
      [category]: prev[category].filter(file => file !== fileToDelete),
    }));
  };

  const handleSubmit = async () => {
    setIsUploading(true);
    const allFiles = Object.entries(filesByCategory).flatMap(([category, files]) =>
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
      return nodeApi.post(`/upload/${category.toLowerCase()}`, formData);
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

  return (
    <div className="homepage-container">
      <img src="/images/fopofo-logo.png" alt="logo" className="nav-logo" onClick={() => navigate("/home")} />
      {/* [수정] 'my page' 버튼을 'logout'과 'Exit' 버튼으로 디자이너의 코드에 맞게 수정 */}
      <div className="noportfolio-top-buttons">
        <button className="outline-btn" onClick={() => {
          // TODO: 실제 로그아웃 로직 구현 필요
          alert("로그아웃 되었습니다.");
          navigate("/login");
        }}>logout</button>
        <button className="outline-btn" onClick={() => navigate("/")}>Exit</button>
      </div>
      <div className="portfolio-upload-container">
        <h1 className="portfolio-upload-title animate-3d">Upload your Portfolio</h1>
        <p className="portfolio-upload-subtitle animate-3d">
          당신의 개성과 창의성이 담긴 포트폴리오를 자유롭게 업로드해주세요!
        </p>
        <div className="category-grid">
          {Object.entries(categoryConfig).map(([category, config]) => (
            <div className="category-box animate-3d" key={category}>
              <div className="category-title">{config.icon}{category}</div>
              <label className="file-label" onClick={() => fileInputRefs[category].current.click()}>파일 선택</label>
              <input type="file" accept={config.accept} multiple ref={fileInputRefs[category]} style={{ display: "none" }} onChange={(e) => handleFileChange(e, category)} />
              <div className="file-list-scroll">
                {filesByCategory[category].map((file, index) => (
                  <div className="file-item" key={index}>
                    <span>{file.name}</span>
                    <button className="delete-btn" onClick={() => handleDelete(category, file)}>×</button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button className="portfolio-next-btn animate-3d" onClick={handleSubmit} disabled={isUploading}>
          {isUploading ? '업로드 중...' : 'Next'}
        </button>
      </div>
    </div>
  );
}