// ✅ 포포포 스타일 반영 + 스피너/알림 메시지 자동처리 개선
import { useState, useEffect, useCallback } from "react";
import { CheckCircle, Circle, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { nodeApi } from "../../services/api";
import * as pdfjsLib from "pdfjs-dist";
import { GlobalWorkerOptions } from "pdfjs-dist";
import "./PortfolioEditPage.css";

GlobalWorkerOptions.workerSrc = `/pdf.worker.mjs`;

const PdfThumbnail = ({ fileUrl, originalName }) => {
    const [thumbUrl, setThumbUrl] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        const generateThumb = async () => {
            try {
                const pdf = await pdfjsLib.getDocument(fileUrl).promise;
                const page = await pdf.getPage(1);
                const viewport = page.getViewport({ scale: 0.5 });
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                await page.render({ canvasContext: context, viewport }).promise;
                setThumbUrl(canvas.toDataURL());
            } catch (err) {
                console.error("PDF 썸네일 생성 실패:", err);
                setError(true);
            }
        };
        if (fileUrl) generateThumb();
    }, [fileUrl]);

    if (error || !thumbUrl) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 p-2">
                <FileText size={48} className="text-gray-500" />
                <span className="text-xs text-center text-gray-600 mt-2 break-all">{originalName}</span>
            </div>
        );
    }

    return <img src={thumbUrl} alt={originalName} className="w-full h-full object-cover bg-white" />;
};

const sanitizeFileName = (filename) => {
    const sanitized = filename.replace(/[^a-zA-Z0-9.\-_]/g, '').replace(/\s+/g, '-');
    return `${Date.now()}-${sanitized}`;
};

const validExtensions = {
    Design: ['.png', '.jpg', '.jpeg'],
    Photo: ['.png', '.jpg', '.jpeg'],
    Video: ['.mp4', '.mov'],
    Document: ['.pdf']
};

export default function PortfolioEditPage() {
    const [category, setCategory] = useState("Design");
    const [items, setItems] = useState({ Design: [], Video: [], Document: [], Photo: [] });
    const [selected, setSelected] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showMessage, setShowMessage] = useState("");
    const navigate = useNavigate();

    const fetchAllPortfolioItems = useCallback(async () => {
        setIsLoading(true);
        try {
            const endpoints = {
                Design: '/user-upload/designs',
                Video: '/user-upload/videos',
                Document: '/user-upload/documents',
                Photo: '/user-upload/photos',
            };
            const requests = Object.values(endpoints).map(endpoint => nodeApi.get(endpoint));
            const responses = await Promise.all(requests);
            setItems({
                Design: responses[0].data.data,
                Video: responses[1].data.data,
                Document: responses[2].data.data,
                Photo: responses[3].data.data,
            });
        } catch (error) {
            console.error("포트폴리오 데이터를 불러오는 중 오류 발생:", error);
            setShowMessage("데이터 로딩 중 오류가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllPortfolioItems();
    }, [fetchAllPortfolioItems]);

    useEffect(() => {
        if (showMessage) {
            const timer = setTimeout(() => setShowMessage(""), 2500);
            return () => clearTimeout(timer);
        }
    }, [showMessage]);

    const addAndUploadFiles = async (newFiles) => {
        const allowedExts = validExtensions[category];
        const filteredFiles = newFiles.filter((file) =>
            allowedExts.some((ext) => file.name.toLowerCase().endsWith(ext))
        );

        if (filteredFiles.length !== newFiles.length) {
            setShowMessage(`❌ ${category} 카테고리는 ${allowedExts.join(", ")} 형식만 허용됩니다.`);
            return;
        }

        if (filteredFiles.length === 0) return;
        setIsLoading(true);
        try {
            const uploadPromises = filteredFiles.map(file => {
                const formData = new FormData();
                const safeFileName = sanitizeFileName(file.name);
                formData.append('file', new File([file], safeFileName, { type: file.type }));
                const fileType = category.toLowerCase();
                return nodeApi.post(`/upload/${fileType}`, formData);
            });
            await Promise.all(uploadPromises);
            setShowMessage(`${filteredFiles.length}개의 파일이 성공적으로 추가되었습니다.`);
            fetchAllPortfolioItems();
        } catch (error) {
            console.error("파일 추가 중 오류 발생:", error);
            setShowMessage("파일 추가에 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileInput = (e) => {
        addAndUploadFiles(Array.from(e.target.files));
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        addAndUploadFiles(Array.from(e.dataTransfer.files));
    }, [addAndUploadFiles]);

    const handleCategoryClick = (type) => {
        setCategory(type);
        setSelected([]);
    };

    const handleSelect = (item) => {
        setSelected((prev) =>
            prev.some(s => s._id === item._id)
                ? prev.filter((s) => s._id !== item._id)
                : [...prev, item]
        );
    };

    const handleDelete = async () => {
        if (selected.length === 0) return setShowMessage("삭제할 파일을 먼저 선택해주세요.");
        if (!window.confirm(`선택한 ${selected.length}개의 파일을 정말로 삭제하시겠습니까?`)) return;
        setIsLoading(true);
        try {
            const deletePromises = selected.map(item => nodeApi.delete(`/user-upload/delete/${item._id}`));
            await Promise.all(deletePromises);
            setShowMessage("선택한 파일이 성공적으로 삭제되었습니다.");
            fetchAllPortfolioItems();
        } catch (error) {
            console.error("파일 삭제 중 오류 발생:", error);
            setShowMessage("파일 삭제에 실패했습니다.");
        } finally {
            setSelected([]);
            setIsLoading(false);
        }
    };

    const handleEdit = () => {
        setShowMessage("모든 변경사항이 저장되었습니다.");
    };

    const renderThumbnail = (item) => {
        if (!item || !item.fileType || !item.originalName) return null;
        if (item.fileType === 'video') {
            return <video src={item.presignedUrl} controls className="w-full h-full object-contain bg-black" />;
        }
        if (['image', 'design', 'photo'].includes(item.fileType)) {
            return <img src={item.presignedUrl} alt={item.originalName} className="w-full h-full object-cover bg-white" />;
        }
        if (item.fileType === 'document') {
            if (item.originalName.toLowerCase().endsWith('.pdf')) {
                return <PdfThumbnail fileUrl={item.presignedUrl} originalName={item.originalName} />;
            } else {
                return (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 p-2">
                        <FileText size={48} className="text-gray-500" />
                        <span className="text-xs text-center text-gray-600 mt-2 break-all">{item.originalName}</span>
                    </div>
                );
            }
        }
        return null;
    };

    return (
        <div className="portfolio-edit-container">
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
                <div className="global-alert">{showMessage}</div>
            )}

            <h1 className="intro-title">My Page</h1>

            <div className="portfolio-edit-box">
                <aside className="portfolio-sidebar">
                    {["Design", "Video", "Document", "Photo"].map((type) => (
                        <button
                            key={type}
                            onClick={() => handleCategoryClick(type)}
                            className={`portfolio-tab-btn ${category === type ? "active" : ""}`}
                        >
                            {type}
                        </button>
                    ))}
                    <label className="portfolio-add-btn">
                        <input
                            type="file"
                            multiple
                            hidden
                            onChange={handleFileInput}
                            accept={validExtensions[category].join(",")}
                        />
                        Add
                    </label>
                    <button onClick={handleDelete} className="portfolio-del-btn">
                        Delete
                    </button>
                    <button onClick={handleEdit} className="edit-btn">
                        Edit
                    </button>
                </aside>

                <section
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="portfolio-grid"
                >
                    {isLoading ? (
                        <div className="loading-box">
                            <div className="spinner" />
                        </div>
                    ) : (
                        items[category].map((item) => (
                            <div
                                key={item._id}
                                className="portfolio-card"
                                onClick={() => handleSelect(item)}
                            >
                                <div className="portfolio-check">
                                    {selected.some(s => s._id === item._id) ? (
                                        <CheckCircle size={20} className="text-white bg-black rounded-full" />
                                    ) : (
                                        <Circle size={20} className="text-white bg-black rounded-full" />
                                    )}
                                </div>
                                {renderThumbnail(item)}
                            </div>
                        ))
                    )}
                </section>
            </div>
        </div>
    );
}
