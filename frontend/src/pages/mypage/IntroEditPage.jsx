import { useState, useCallback } from "react";
import { X, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { nodeApi } from "../../services/api";
import * as pdfjsLib from "pdfjs-dist";
import { GlobalWorkerOptions } from "pdfjs-dist";
import "./IntroEditPage.css";

GlobalWorkerOptions.workerSrc = `/pdf.worker.mjs`;

export default function IntroEditPage() {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewFile, setPreviewFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [showMessage, setShowMessage] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();

    const renderPDFPreview = async (file) => {
        const reader = new FileReader();
        return new Promise((resolve) => {
            reader.onload = async () => {
                const typedarray = new Uint8Array(reader.result);
                const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
                const page = await pdf.getPage(1);
                const viewport = page.getViewport({ scale: 1.2 });

                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");
                canvas.width = viewport.width;
                canvas.height = viewport.height;

                await page.render({ canvasContext: context, viewport }).promise;
                const imageData = canvas.toDataURL("image/png");
                resolve(imageData);
            };
            reader.readAsArrayBuffer(file);
        });
    };

    const handleFiles = async (incomingFiles) => {
        const validFiles = Array.from(incomingFiles).filter(
            (file) => file.type === "application/pdf"
        );

        if (validFiles.length !== incomingFiles.length) {
            alert("PDF 형식의 파일만 업로드하실 수 있습니다.");
        }

        const newList = [...selectedFiles, ...validFiles];
        setSelectedFiles(newList);

        const latestFile = validFiles[validFiles.length - 1];
        if (latestFile) {
            const preview = await renderPDFPreview(latestFile);
            setPreviewFile(latestFile);
            setPreviewUrl(preview);
        }
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
    }, [selectedFiles]);

    const handleFileClick = async (file) => {
        const preview = await renderPDFPreview(file);
        setPreviewFile(file);
        setPreviewUrl(preview);
    };

    const handleDelete = async (fileToDelete) => {
        const updatedFiles = selectedFiles.filter((file) => file !== fileToDelete);
        setSelectedFiles(updatedFiles);

        if (updatedFiles.length > 0) {
            const newPreview = await renderPDFPreview(updatedFiles[0]);
            setPreviewFile(updatedFiles[0]);
            setPreviewUrl(newPreview);
        } else {
            setPreviewFile(null);
            setPreviewUrl(null);
        }
    };

    const handleEdit = async () => {
        if (selectedFiles.length === 0) {
            alert("대체할 파일을 하나 이상 선택해주세요.");
            return;
        }

        setIsProcessing(true);
        setShowMessage("자기소개서를 업데이트하는 중입니다...");

        try {
            await nodeApi.delete("/user-upload/resume/all");

            const uploadPromises = selectedFiles.map((file) => {
                const formData = new FormData();
                formData.append("file", file);
                return nodeApi.post("/upload/resume", formData);
            });

            await Promise.all(uploadPromises);
            setShowMessage("성공적으로 업데이트되었습니다!");
            setTimeout(() => {
                setShowMessage("");
                navigate("/mypage");
            }, 2000);
        } catch (error) {
            console.error("업데이트 중 오류:", error);
            setShowMessage("오류가 발생했습니다. 다시 시도해주세요.");
            setTimeout(() => setShowMessage(""), 3000);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="intro-edit-container">
            {/* ✅ 상단 고정 로고 / 버튼 */}
            <img
                src="/Fopofo-Logo-v2.png"
                alt="FoPoFo Logo"
                className="intro-logo"
                onClick={() => navigate("/")}
            />
            <div className="intro-buttons">
                <button className="outline-btn" onClick={() => navigate("/mypage")}>←</button>
                <button className="outline-btn" onClick={() => navigate("/")}>logout</button>
                <button className="outline-btn" onClick={() => navigate("/home")}>home</button>
            </div>

            {showMessage && (
                <div className="global-alert">
                    {showMessage}
                </div>
            )}

            <h1 className="intro-title">My Page</h1>

            <div className="intro-box">
                {previewUrl ? (
                    <img
                        src={previewUrl}
                        alt={previewFile?.name}
                        className="max-w-[85%] max-h-[500px] mx-auto rounded-md shadow"
                    />
                ) : (
                    <div className="bg-white border border-gray-300 rounded-md p-4 text-center text-gray-500">
                        여기에 선택한 자기소개서 미리보기가 표시됩니다 (PDF)
                    </div>
                )}

                <label htmlFor="fileUpload" className="upload-label">
                    파일 선택 (PDF만 가능)
                </label>
                <input
                    id="fileUpload"
                    type="file"
                    accept="application/pdf"
                    multiple
                    onChange={(e) => handleFiles(e.target.files)}
                    className="hidden"
                />

                <div className="file-list">
                    {selectedFiles.map((file, index) => (
                        <div key={index} className="file-item">
                            <span onClick={() => handleFileClick(file)} className="flex items-center gap-2 flex-1 cursor-pointer">
                                <FileText size={16} className="text-gray-500" />
                                {file.name}
                            </span>
                            <button onClick={() => handleDelete(file)} className="delete-btn">
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleEdit}
                    disabled={isProcessing}
                    className="edit-btn"
                >
                    {isProcessing ? "처리 중..." : "Edit"}
                </button>
            </div>
        </div>
    );
}
