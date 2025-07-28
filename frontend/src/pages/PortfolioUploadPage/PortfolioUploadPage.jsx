import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Paintbrush,
  Video,
  FileText,
  Image as ImageIcon,
  X,
} from "lucide-react";
import "./PortfolioUploadPage.css";

const categoryConfig = {
  Design: {
    icon: <Paintbrush className="icon" />,
    extensions: [".jpg", ".jpeg", ".png"],
    accept: "image/jpeg, image/png",
  },
  Video: {
    icon: <Video className="icon" />,
    extensions: [".mp4", ".mov", ".avi", ".mkv"],
    accept: "video/*",
  },
  Document: {
    icon: <FileText className="icon" />,
    extensions: [".pdf"],
    accept: "application/pdf",
  },
  Photo: {
    icon: <ImageIcon className="icon" />,
    extensions: [".jpg", ".jpeg", ".png"],
    accept: "image/jpeg, image/png",
  },
};

export default function PortfolioUploadPage() {
  const navigate = useNavigate();
  const [filesByCategory, setFilesByCategory] = useState({
    Design: [],
    Video: [],
    Document: [],
    Photo: [],
  });

  const fileInputRefs = {
    Design: useRef(null),
    Video: useRef(null),
    Document: useRef(null),
    Photo: useRef(null),
  };

  const handleFileChange = (e, category) => {
    const selectedFiles = Array.from(e.target.files);
    const isValid = (file) => {
      const name = file.name.toLowerCase();
      return categoryConfig[category].extensions.some((ext) =>
        name.endsWith(ext)
      );
    };
    const invalidFile = selectedFiles.find((file) => !isValid(file));
    if (invalidFile) {
      alert(`❌ ${category} 카테고리에 올바르지 않은 파일 형식입니다.`);
      return;
    }
    setFilesByCategory((prev) => ({
      ...prev,
      [category]: [...prev[category], ...selectedFiles],
    }));
  };

  const handleDelete = (category, index) => {
    setFilesByCategory((prev) => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    const totalFiles = Object.values(filesByCategory).flat().length;
    if (totalFiles === 0) {
      alert("파일을 하나 이상 업로드해주세요.");
      return;
    }

    console.log("업로드 파일 목록:", filesByCategory);
    navigate("/upload/chatbot");
  };

  return (
    <div
      className="homepage-container"
      style={{
        backgroundImage: `url("/Grid.png")`,
        backgroundRepeat: "repeat",
        backgroundSize: "contain",
        backgroundAttachment: "fixed",
        backgroundColor: "#fff0f5",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      {/* 좌측 상단 로고 */}
      <img
        src="/images/fopofo-logo.png"
        alt="fopofo logo"
        className="nav-logo"
        onClick={() => navigate("/")}
      />

      {/* 우측 상단 버튼 */}
      <div className="noportfolio-top-buttons">
        <button className="outline-btn" onClick={() => navigate("/")}>
          logout
        </button>
        <button className="outline-btn" onClick={() => navigate("/home")}>
          Exit
        </button>
      </div>

      {/* 본문 */}
      <div className="portfolio-upload-container">
        <h1 className="portfolio-upload-title animate-3d">
          Upload your Portfolio
        </h1>

        <p className="portfolio-upload-subtitle animate-3d">
          당신의 개성과 창의성이 담긴 포트폴리오를 자유롭게 업로드해주세요!
        </p>

        <div className="category-grid">
          {Object.entries(categoryConfig).map(([category, config]) => (
            <div className="category-box animate-3d" key={category}>
              <div className="category-title">
                <span className="icon">{config.icon}</span>
                {category}
              </div>

              <label
                className="file-label"
                onClick={() => fileInputRefs[category].current.click()}
              >
                파일 선택
              </label>
              <input
                type="file"
                accept={config.accept}
                multiple
                ref={fileInputRefs[category]}
                style={{ display: "none" }}
                onChange={(e) => handleFileChange(e, category)}
              />

              <div className="file-list-scroll">
                {filesByCategory[category].map((file, index) => (
                  <div className="file-item" key={index}>
                    {file.name}
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(category, index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button className="portfolio-next-btn animate-3d" onClick={handleSubmit}>
          Next
        </button>
      </div>
    </div>
  );
}
