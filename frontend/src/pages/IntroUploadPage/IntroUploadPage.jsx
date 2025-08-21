import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './IntroUploadPage.css';
import { nodeApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

function IntroUploadPage() {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const navigate = useNavigate();
    const { logout } = useAuth();
    // ✅ 1. input을 참조하기 위한 ref를 생성합니다.
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type !== 'application/pdf') {
            alert('PDF 파일만 업로드 가능합니다.');
            return;
        }
        setFile(selectedFile);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.type !== 'application/pdf') {
            alert('PDF 파일만 업로드 가능합니다.');
            return;
        }
        setFile(droppedFile);
    };

    const handleDelete = () => {
        setFile(null);
    };

    const handleNextClick = async () => {
        if (!file) {
            alert('파일을 업로드해주세요.');
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        const fileType = 'resume';

        try {
            await nodeApi.post(`/api/upload/${fileType}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('파일이 성공적으로 업로드되었습니다!');
            navigate('/upload');
        } catch (error) {
            console.error('업로드 실패:', error);
            alert('업로드 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsUploading(false);
        }
    };
    
    const handleLogout = () => {
        logout();
        navigate('/mainpage');
    };

    return (
        <div
            className="homepage-container"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
        >
            <img
                src="/Fopofo-Logo-v2.png"
                alt="logo"
                className="nav-logo"
                onClick={() => navigate('/mainpage')}
            />

            <div className="noportfolio-top-buttons">
                <button className="outline-btn" onClick={handleLogout}>logout</button>
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
                    <label 
                        htmlFor="intro-file-upload" 
                        className="intro-upload-label"
                        // ✅ 2. onClick 이벤트를 추가하여 input 값을 초기화합니다.
                        onClick={() => {
                            if (fileInputRef.current) {
                                fileInputRef.current.value = null;
                            }
                        }}
                    >
                        파일 선택 (PDF만 가능)
                    </label>
                    <input
                        type="file"
                        id="intro-file-upload"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        ref={fileInputRef} // ✅ 3. input에 ref를 연결합니다.
                        style={{ display: 'none' }}
                    />

                    <div className="intro-file-list">
                        {file ? (
                            <div className="intro-file-item animate-fade-in">
                                {file.name}
                                <button
                                    className="intro-delete-btn"
                                    onClick={handleDelete}
                                >
                                    ×
                                </button>
                            </div>
                        ) : (
                          <p style={{ color: '#888', fontSize: '0.9rem' }}>선택된 파일이 없습니다.</p>
                        )}
                    </div>

                    <button 
                        className="intro-next-btn" 
                        onClick={handleNextClick}
                        disabled={isUploading}
                    >
                        {isUploading ? '업로드 중...' : 'Next'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default IntroUploadPage;