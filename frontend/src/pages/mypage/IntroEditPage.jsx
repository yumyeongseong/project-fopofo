// IntroEditPage.jsx (최종 수정된 전체 코드)

import { useState, useCallback, useRef, useEffect } from "react"; // ✅ useEffect 추가
import { useNavigate } from "react-router-dom";
import './IntroEditPage.css';
import { nodeApi } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { X, FileText } from "lucide-react";
import PdfThumbnail from "../../components/PdfThumbnail";

export default function IntroEditPage() {
    const [selectedFiles, setSelectedFiles] = useState([]);
    // ✅ 미리보기를 위해 원본 파일 객체가 아닌, 안전한 임시 URL을 저장합니다.
    const [previewUrl, setPreviewUrl] = useState(null);

    const [showMessage, setShowMessage] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const { logout } = useAuth();

    // ✅ 파일이 선택될 때 원본 파일과 미리보기 URL을 분리하여 저장합니다.
    const handleFiles = useCallback((incomingFiles) => {
        const validFiles = Array.from(incomingFiles).filter(f => f.type === "application/pdf");
        if (validFiles.length !== incomingFiles.length) {
            alert("PDF 형식의 파일만 업로드할 수 있습니다.");
        }

        const newList = [...selectedFiles, ...validFiles];
        setSelectedFiles(newList);

        if (validFiles.length > 0) {
            const latestFile = validFiles[validFiles.length - 1];
            // 이전에 생성된 URL이 있다면 메모리에서 해제합니다.
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
            // 가장 최근 파일로 새로운 미리보기 URL을 생성합니다.
            setPreviewUrl(URL.createObjectURL(latestFile));
        }
    }, [selectedFiles, previewUrl]); // ✅ previewUrl을 의존성 배열에 추가합니다.

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
    }, [handleFiles]);

    // ✅ 파일 목록에서 파일을 클릭했을 때의 동작입니다.
    const handleFileClick = useCallback((file) => {
        // 이전에 생성된 URL이 있다면 메모리에서 해제합니다.
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        // 클릭된 파일로 새로운 미리보기 URL을 생성합니다.
        setPreviewUrl(URL.createObjectURL(file));
    }, [previewUrl]); // ✅ previewUrl을 의존성 배열에 추가합니다.

    const handleDelete = useCallback((fileToDelete) => {
        const updatedFiles = selectedFiles.filter((file) => file !== fileToDelete);
        setSelectedFiles(updatedFiles);

        // ✅ 파일을 삭제한 후 미리보기 대상을 업데이트합니다.
        if (updatedFiles.length > 0) {
            // 목록의 첫 번째 파일로 미리보기를 다시 생성합니다.
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            setPreviewUrl(URL.createObjectURL(updatedFiles[0]));
        } else {
            // 모든 파일이 삭제되면 미리보기도 초기화합니다.
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }
    }, [selectedFiles, previewUrl]); // ✅ previewUrl을 의존성 배열에 추가합니다.

    // ✅ 컴포넌트가 사라질 때 생성된 URL을 메모리에서 해제하여 메모리 누수를 방지합니다.
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    // handleEdit 함수는 이제 충돌 걱정 없이 selectedFiles를 안전하게 사용할 수 있습니다.
    const handleEdit = async () => {
        if (selectedFiles.length === 0) {
            alert("대체할 파일을 하나 이상 선택해주세요.");
            return;
        }
        setIsProcessing(true);
        setShowMessage("자기소개서를 업데이트하는 중입니다...");
        try {
            await nodeApi.delete('/api/user-upload/resume/all');

            const uploadPromises = selectedFiles.map(file => {
                const formData = new FormData();
                // 원본 file 객체의 내용만 복사하여 새로운 Blob 객체를 만듭니다.
                const fileBlob = new Blob([file], { type: file.type });
                // 복사본 Blob을 원래 파일 이름으로 전송합니다.
                formData.append('file', fileBlob, file.name);
                return nodeApi.post('/api/upload/resume', formData);
            });

            await Promise.all(uploadPromises);

            setShowMessage("성공적으로 업데이트되었습니다!");
            setTimeout(() => {
                setShowMessage("");
                navigate('/mypage');
            }, 2000);
        } catch (error) {
            console.error("업데이트 중 오류 발생:", error);
            setShowMessage("오류가 발생했습니다. 다시 시도해주세요.");
            setTimeout(() => setShowMessage(""), 3000);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/mainpage');
    };

    return (
        <div className="intro-edit-container">
            <img
                src="/Fopofo-Logo-v2.png"
                alt="FoPoFo Logo"
                className="intro-logo"
                onClick={() => navigate("/mainpage")}
            />
            <div className="intro-buttons">
                <button className="outline-btn" onClick={() => navigate("/mypage")}>←</button>
                <button className="outline-btn" onClick={handleLogout}>logout</button>
                <button className="outline-btn" onClick={() => navigate("/home")}>home</button>
            </div>

            {showMessage && (<div className="global-alert">{showMessage}</div>)}

            <h1 className="intro-title">Edit Introduction</h1>
            <div className="intro-box" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
                {previewUrl ? (
                    // ✅ 표준 썸네일 컴포넌트에 원본 파일 대신 안전한 URL을 전달합니다.
                    <PdfThumbnail file={previewUrl} width={400} />
                ) : (
                    <div className="preview-placeholder">PDF 파일을 선택하면 여기에 미리보기가 표시됩니다.</div>
                )}

                <label
                    htmlFor="fileUpload"
                    className="upload-label"
                    onClick={() => { if (fileInputRef.current) { fileInputRef.current.value = null; } }}
                >
                    파일 선택 (PDF만 가능)
                </label>
                <input
                    id="fileUpload"
                    type="file"
                    accept="application/pdf"
                    multiple
                    onChange={(e) => handleFiles(e.target.files)}
                    ref={fileInputRef}
                    className="hidden"
                    style={{ display: 'none' }}
                />

                <div className="file-list">
                    {selectedFiles.map((file, index) => (
                        <div key={index} className="file-item">
                            <span onClick={() => handleFileClick(file)} className="file-item-name">
                                <FileText size={16} />
                                {file.name}
                            </span>
                            <button onClick={() => handleDelete(file)} className="delete-btn">
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                </div>

                <button onClick={handleEdit} disabled={isProcessing} className="edit-btn">
                    {isProcessing ? "업데이트 중..." : "Edit"}
                </button>
            </div>
        </div>
    );
}