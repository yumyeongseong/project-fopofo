import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChatbotFileUpload.css'; // ✅ 새로운 디자인의 CSS 파일을 사용합니다.
import { pythonApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

function ChatbotFileUpload() {
    // ✅ 1. 여러 파일이 아닌 단일 파일만 처리하도록 state를 수정합니다.
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    
    // ✅ 2. 파일 재업로드 버그 수정을 위해 useRef를 추가합니다.
    const fileInputRef = useRef(null);
    
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
            alert('PDF 파일만 업로드 가능합니다.');
            return;
        }
        setFile(selectedFile);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && !droppedFile.name.toLowerCase().endsWith('.pdf')) {
            alert('PDF 파일만 업로드 가능합니다.');
            return;
        }
        setFile(droppedFile);
    };

    const handleDelete = () => {
        setFile(null);
    };

    const handleNext = async () => {
        if (!file) {
            alert('파일을 업로드해주세요.');
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            // ✅ 3. 기존의 안정적인 pythonApi 업로드 로직을 사용합니다.
            await pythonApi.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('파일 업로드 및 챗봇 학습 준비 완료!');
            navigate('/prompt/chatbot');
        } catch (error) {
            if (error.response?.status === 401) {
                alert('인증 정보가 유효하지 않습니다. 다시 로그인해주세요.');
                navigate('/login');
            } else {
                alert('파일 업로드에 실패했습니다. 다시 시도해주세요.');
            }
        } finally {
            setIsUploading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/mainpage');
    };

    // ✅ 4. 새로운 디자인(ChatbotFileUpload1.jsx)의 JSX 구조를 적용하고 모든 기능을 연결합니다.
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
                    Upload documents for your chatbot
                </h1>
                <p className="intro-upload-subtitle animate-3d">
                    챗봇이 학습할 자기소개서, 이력서 등을 업로드해주세요.
                </p>
                <div className="intro-upload-box animate-3d">
                    <label 
                        htmlFor="chatbot-file-upload" 
                        className="intro-upload-label"
                        // ✅ 5. 재업로드 버그 수정을 위한 onClick 로직을 추가합니다.
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
                        id="chatbot-file-upload"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                    />
                    <div className="intro-file-list">
                        {file ? (
                            <div className="intro-file-item animate-fade-in">
                                {file.name}
                                <button className="intro-delete-btn" onClick={handleDelete}>×</button>
                            </div>
                        ) : (
                            <p style={{ color: '#888', fontSize: '0.9rem' }}>선택된 파일이 없습니다.</p>
                        )}
                    </div>
                    <button 
                        className="intro-next-btn" 
                        onClick={handleNext} 
                        disabled={isUploading}
                    >
                        {isUploading ? '업로드 중...' : 'Next'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChatbotFileUpload;