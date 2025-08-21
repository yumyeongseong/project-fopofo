import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './PortfolioUploadPage.css'; // ✅ 새로운 디자인의 CSS 파일을 사용합니다.
import { nodeApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
// ✅ 1. 새로운 디자인에 필요한 아이콘들을 lucide-react에서 가져옵니다.
import { Paintbrush, Video, FileText, Image as ImageIcon } from "lucide-react";

// ✅ 2. 파일 형식 검증을 위한 설정을 추가합니다. (새 디자인의 장점)
const categoryConfig = {
    Design: { icon: <Paintbrush className="icon" />, extensions: [".jpg", ".jpeg", ".png"], accept: "image/jpeg, image/png" },
    Video: { icon: <Video className="icon" />, extensions: [".mp4", ".mov", ".avi"], accept: "video/*" },
    Document: { icon: <FileText className="icon" />, extensions: [".pdf"], accept: "application/pdf" },
    Photo: { icon: <ImageIcon className="icon" />, extensions: [".jpg", ".jpeg", ".png"], accept: "image/jpeg, image/png" },
};

function PortfolioUploadPage() {
    // ✅ 3. 기존의 안정적인 기능 로직을 대부분 그대로 사용합니다.
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [filesToUpload, setFilesToUpload] = useState({ Design: [], Video: [], Document: [], Photo: [] });
    const [isUploading, setIsUploading] = useState(false);

    // ✅ 4. 깔끔한 파일 선택 UI를 위해 useRef를 사용합니다. (새 디자인의 장점)
    const fileInputRefs = {
        Design: useRef(null), Video: useRef(null), Document: useRef(null), Photo: useRef(null)
    };

    const handleFileChange = (e, category) => {
        const newFiles = Array.from(e.target.files);
        if (newFiles.length === 0) return;

        // 파일 형식 검증 로직 추가 (새 디자인의 장점)
        const isValid = (file) => categoryConfig[category].extensions.some(ext => file.name.toLowerCase().endsWith(ext));
        const invalidFile = newFiles.find(file => !isValid(file));
        if (invalidFile) {
            alert(`❌ ${category} 카테고리에는 다음 형식의 파일만 업로드할 수 있습니다:\n${categoryConfig[category].extensions.join(', ')}`);
            return;
        }

        setFilesToUpload(prev => {
            const existingFiles = prev[category];
            const uniqueNewFiles = newFiles.filter(nf => !existingFiles.some(ef => ef.name === nf.name));
            return { ...prev, [category]: [...existingFiles, ...uniqueNewFiles] };
        });
    };

    const handleFileDelete = (category, fileName) => {
        setFilesToUpload(prev => ({
            ...prev,
            [category]: prev[category].filter(file => file.name !== fileName),
        }));
    };

    const handleNextClick = async () => {
        setIsUploading(true);
        const allFiles = Object.entries(filesToUpload).flatMap(([category, files]) => files.map(file => ({ file, category })));

        if (allFiles.length === 0) {
            alert("업로드할 파일이 없습니다. 다음 단계로 진행합니다.");
            navigate('/upload/chatbot'); // 다음 페이지 경로 확인 필요
            setIsUploading(false);
            return;
        }

        const uploadPromises = allFiles.map(({ file, category }) => {
            const formData = new FormData();
            formData.append('file', file);
            return nodeApi.post(`/api/upload/${category.toLowerCase()}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        });

        try {
            await Promise.all(uploadPromises);
            alert("모든 파일이 성공적으로 업로드되었습니다!");
            navigate('/upload/chatbot'); // 다음 페이지 경로 확인 필요
        } catch (error) {
            console.error("파일 업로드 중 오류 발생:", error);
            alert("파일 업로드에 실패했습니다. 파일을 다시 확인해주세요.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/mainpage');
    };

    // ✅ 5. 새로운 디자인(PortfolioUploadPage1.jsx)의 JSX 구조를 적용하고 함수들을 연결합니다.
    return (
        <div className="homepage-container">
            <img
                src="/Fopofo-Logo-v2.png"
                alt="fopofo logo"
                className="nav-logo"
                onClick={() => navigate('/mainpage')}
            />
            <div className="noportfolio-top-buttons">
                <button className="outline-btn" onClick={handleLogout}>logout</button>
                <button className="outline-btn" onClick={() => navigate('/home')}>Exit</button>
            </div>
            <div className="portfolio-upload-container">
                <h1 className="portfolio-upload-title animate-3d">Upload your Portfolio</h1>
                <p className="portfolio-upload-subtitle animate-3d">
                    당신의 개성과 창의성이 담긴 포트폴리오를 자유롭게 업로드해주세요!
                </p>
                <div className="category-grid">
                    {Object.entries(categoryConfig).map(([category, config]) => (
                        <div className="category-box animate-3d" key={category}>
                            <div className="category-title">
                                {config.icon}
                                {category}
                            </div>
                            <label className="file-label" onClick={() => {
                                if (fileInputRefs[category].current) {
                                    fileInputRefs[category].current.value = null;
                                }
                                fileInputRefs[category].current.click();
                            }}>
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
                                {filesToUpload[category].map((file) => (
                                    <div className="file-item" key={file.name}>
                                        <span className="file-name">{file.name}</span>
                                        <button className="delete-btn" onClick={() => handleFileDelete(category, file.name)}>
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <button className="portfolio-next-btn animate-3d" onClick={handleNextClick} disabled={isUploading}>
                    {isUploading ? '업로드 중...' : 'Next'}
                </button>
            </div>
        </div>
    );
}

export default PortfolioUploadPage;