import { useState, useCallback } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { GlobalWorkerOptions } from "pdfjs-dist";

import { X, FileText } from "lucide-react";
import { nodeApi } from "../../services/api";
import { useNavigate } from "react-router-dom";
import MypageHeader from "../../components/MypageHeader";

GlobalWorkerOptions.workerSrc = `/pdf.worker.mjs`;

export default function IntroEditPage() {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewFile, setPreviewFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [showMessage, setShowMessage] = useState("");

    const [isProcessing, setIsProcessing] = useState(false);

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

    const navigate = useNavigate();

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

    const handleDrop = useCallback(
        (e) => {
            e.preventDefault();
            handleFiles(e.dataTransfer.files);
        },
        [selectedFiles]
    );

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
            // 1단계: 백엔드에 기존 resume 파일 전체 삭제를 요청
            await nodeApi.delete('/user-upload/resume/all');
            
            // 2단계: 새로 선택된 파일들을 업로드
            const uploadPromises = selectedFiles.map(file => {
                const formData = new FormData();
                formData.append('file', file);
                return nodeApi.post('/upload/resume', formData);
            });
            await Promise.all(uploadPromises);

            setShowMessage("성공적으로 업데이트되었습니다!");
            setTimeout(() => {
                setShowMessage("");
                // 3단계: 요청하신 대로 /mypage 경로로 이동
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

    return (
        <div className="min-h-screen bg-pink-100 flex flex-col relative">
            <MypageHeader />

            {showMessage && (
                <div className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-white text-black px-6 py-2 rounded-full shadow-lg transition-opacity duration-300 z-50">
                    {showMessage}
                </div>
            )}

            <main className="flex-grow flex justify-center items-center px-4 pb-8">
                <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="bg-gradient-to-b from-blue-100 to-blue-200 w-[95%] max-w-5xl min-h-[600px] px-6 py-10 rounded-xl shadow-md flex flex-col items-center"
                >
                    <div className="w-full max-w-3xl mb-6">
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
                    </div>

                    <div className="flex justify-center mb-4">
                        <label
                            htmlFor="fileUpload"
                            className="bg-pink-300 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-pink-400 transition"
                        >
                            파일 선택
                        </label>
                        <input
                            id="fileUpload"
                            type="file"
                            accept="application/pdf"
                            multiple
                            onChange={(e) => handleFiles(e.target.files)}
                            className="hidden"
                        />
                    </div>

                    <div className="w-full max-w-3xl mt-4 space-y-2">
                        {selectedFiles.map((file, index) => (
                            <div
                                key={index}
                                className={`flex justify-between items-center px-4 py-2 rounded-md transition text-sm cursor-pointer ${previewFile?.name === file.name
                                    ? "bg-white font-semibold shadow"
                                    : "text-gray-700 hover:bg-white hover:shadow"
                                    }`}
                            >
                                <span onClick={() => handleFileClick(file)} className="flex items-center gap-2 flex-1">
                                    <FileText size={16} className="text-gray-500" />
                                    {file.name}
                                </span>
                                <button
                                    onClick={() => handleDelete(file)}
                                    className="ml-4 text-gray-500 hover:text-red-500"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handleEdit}
                        className="mt-6 bg-pink-200 text-brown-700 px-6 py-2 rounded-full shadow-sm hover:shadow-md transition"
                    >
                        Edit
                    </button>
                </div>
            </main>
        </div>
    );
}
