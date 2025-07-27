import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PortfolioUploadPage.css';
import { nodeApi } from '../../services/api';

function PortfolioUploadPage() {
    const navigate = useNavigate();
    // ✅ 각 카테고리별로 업로드할 파일(File 객체)들을 저장하는 상태
    const [filesToUpload, setFilesToUpload] = useState({
        Design: [],
        Video: [],
        Document: [],
        Photo: [],
    });
    // ✅ Next 버튼을 눌렀을 때 로딩 상태를 표시하기 위한 상태
    const [isUploading, setIsUploading] = useState(false);

    // ✅ 1. 파일을 선택했을 때, 실제 파일을 state에 저장하는 기능
    const handleFileChange = (e, category) => {
        const newFiles = Array.from(e.target.files);
        if (newFiles.length === 0) return;

        // 기존 파일 목록에 새로 선택한 파일들을 추가 (중복 방지)
        setFilesToUpload(prev => {
            const existingFiles = prev[category];
            const uniqueNewFiles = newFiles.filter(
                (newFile) => !existingFiles.some((existingFile) => existingFile.name === newFile.name)
            );
            return {
                ...prev,
                [category]: [...existingFiles, ...uniqueNewFiles],
            };
        });
    };

    // ✅ 2. 빼기(-) 버튼 클릭 시, 업로드 예정 목록에서만 파일을 제거하는 기능
    const handleFileDelete = (category, fileName) => {
        setFilesToUpload((prev) => ({
            ...prev,
            [category]: prev[category].filter((file) => file.name !== fileName),
        }));
    };

    // ✅ 3. Next 버튼 클릭 시, 모든 파일을 한 번에 AWS에 업로드하는 기능
    const handleNextClick = async () => {
        setIsUploading(true); // 업로드 시작
        
        // 모든 카테고리의 파일들을 하나의 배열로 만듭니다.
        const allFiles = Object.entries(filesToUpload).flatMap(([category, files]) => 
            files.map(file => ({ file, category }))
        );

        if (allFiles.length === 0) {
            alert("업로드할 파일이 없습니다. 다음 단계로 진행합니다.");
            navigate('/upload/chatbot');
            return;
        }

        // Promise.all을 사용해 모든 파일 업로드를 동시에 시도합니다.
        const uploadPromises = allFiles.map(({ file, category }) => {
            const formData = new FormData();
            formData.append('file', file);
            // 각 파일에 맞는 API 엔드포인트로 요청을 보냅니다.
            return nodeApi.post(`/upload/${category.toLowerCase()}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        });

        try {
            // 모든 업로드가 성공할 때까지 기다립니다.
            await Promise.all(uploadPromises);
            
            alert("모든 파일이 성공적으로 업로드되었습니다!");
            navigate('/upload/chatbot'); // 성공 시 다음 페이지로 이동
        
        } catch (error) {
            // ✅ 4. 단 하나라도 업로드에 실패하면 에러 메시지를 보여주고 페이지에 머무릅니다.
            console.error("파일 업로드 중 오류 발생:", error);
            alert("파일 업로드에 실패했습니다. 파일을 다시 확인해주세요.");
        } finally {
            setIsUploading(false); // 업로드 종료 (성공/실패 모두)
        }
    };

    const handleLogoClick = () => navigate('/mainpage');

    // --- JSX 렌더링 부분 (기존 UI 구조 100% 유지) ---
    return (
        <div className="upload-container">
            <header className="upload-header">
                <img src="/fopofo-logo.png" alt="logo" className="upload-logo" onClick={handleLogoClick}/>
                <button className="mypage-button-upload" onClick={() => navigate('/mypage')}>my page</button>
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
                                // 파일을 선택하면 handleFileChange 함수가 실행됩니다.
                                onChange={(e) => handleFileChange(e, category)}
                            />
                            <ul className="file-list">
                                {/* filesToUpload 상태에 저장된 파일 목록을 화면에 보여줍니다. */}
                                {filesToUpload[category].map((file) => (
                                    <li key={file.name}>
                                        {file.name}
                                        {/* 빼기 버튼은 파일의 이름(고유값)을 기준으로 목록에서 제거합니다. */}
                                        <button className="delete-button" onClick={() => handleFileDelete(category, file.name)}>
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
                {/* isUploading 상태에 따라 버튼이 비활성화되고 텍스트가 바뀝니다. */}
                <button className="next-button" onClick={handleNextClick} disabled={isUploading}>
                    {isUploading ? '업로드 중...' : 'Next'}
                </button>
            </footer>
        </div>
    );
}

export default PortfolioUploadPage;