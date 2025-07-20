import { useState, useEffect, useCallback } from "react";
import { CheckCircle, Circle, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MypageHeader from "../../components/MypageHeader";
import { nodeApi } from "../../services/api";
import * as pdfjsLib from "pdfjs-dist";
import { GlobalWorkerOptions } from "pdfjs-dist";

// PDF.js 워커 경로를 설정합니다. (이전에 public 폴더에 복사한 파일)
GlobalWorkerOptions.workerSrc = `/pdf.worker.mjs`;

// ✅ PDF 파일의 URL을 받아 썸네일 이미지를 생성하는 별도의 컴포넌트
const PdfThumbnail = ({ fileUrl, originalName }) => {
    const [thumbUrl, setThumbUrl] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        const generateThumb = async () => {
            try {
                const pdf = await pdfjsLib.getDocument(fileUrl).promise;
                const page = await pdf.getPage(1);
                const viewport = page.getViewport({ scale: 0.5 }); // 썸네일용으로 작은 스케일 사용
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                await page.render({ canvasContext: context, viewport }).promise;
                setThumbUrl(canvas.toDataURL());
            } catch (err) {
                console.error("PDF 썸네일 생성 실패:", err);
                setError(true); // 에러 발생 시 상태 업데이트
            }
        };
        if (fileUrl) {
            generateThumb();
        }
    }, [fileUrl]);

    // 썸네일 생성에 실패했거나 로딩 중일 때 아이콘 표시
    if (error || !thumbUrl) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 p-2">
                <FileText size={48} className="text-gray-500" />
                <span className="text-xs text-center text-gray-600 mt-2 break-all">{originalName}</span>
            </div>
        );
    }
    // 성공 시 이미지 썸네일 표시
    return <img src={thumbUrl} alt={`${originalName} preview`} className="w-full h-full object-cover bg-white" />;
};

// 파일명을 안전한 영문+숫자 이름으로 바꿔주는 헬퍼 함수
const sanitizeFileName = (filename) => {
    const sanitized = filename.replace(/[^a-zA-Z0-9.\-_]/g, '').replace(/\s+/g, '-');
    return `${Date.now()}-${sanitized}`;
};

export default function PortfolioEditPage() {
    const [category, setCategory] = useState("Design");
    const [items, setItems] = useState({ Design: [], Video: [], Document: [], Photo: [] });
    const [selected, setSelected] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
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
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllPortfolioItems();
    }, [fetchAllPortfolioItems]);

    const addAndUploadFiles = async (newFiles) => {
        if (newFiles.length === 0) return;
        setIsLoading(true);
        try {
            const uploadPromises = newFiles.map(file => {
                const formData = new FormData();
                const safeFileName = sanitizeFileName(file.name);
                formData.append('file', new File([file], safeFileName, { type: file.type }));
                const fileType = category.toLowerCase();
                return nodeApi.post(`/upload/${fileType}`, formData);
            });
            await Promise.all(uploadPromises);
            alert(`${newFiles.length}개의 파일이 성공적으로 추가되었습니다.`);
            fetchAllPortfolioItems();
        } catch (error) {
            console.error("파일 추가 중 오류 발생:", error);
            alert("파일 추가에 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ 누락되었던 모든 핸들러 함수를 포함합니다.
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
        if (selected.length === 0) return alert("삭제할 파일을 먼저 선택해주세요.");
        if (!window.confirm(`선택한 ${selected.length}개의 파일을 정말로 삭제하시겠습니까?`)) return;
        setIsLoading(true);
        try {
            const deletePromises = selected.map(item => nodeApi.delete(`/user-upload/delete/${item._id}`));
            await Promise.all(deletePromises);
            alert("선택한 파일이 성공적으로 삭제되었습니다.");
            fetchAllPortfolioItems();
        } catch (error) {
            console.error("파일 삭제 중 오류 발생:", error);
            alert("파일 삭제에 실패했습니다.");
        } finally {
            setSelected([]);
            setIsLoading(false);
        }
    };

    const handleEdit = () => {
        alert("모든 변경사항이 저장되었습니다.");
        navigate('/mypage');
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
        <div className="min-h-screen bg-pink-100 flex flex-col">
            <MypageHeader />
            <div className="flex flex-1">
                <div className="flex flex-col gap-4 p-6">
                    {["Design", "Video", "Document", "Photo"].map((type) => (
                        <button key={type} onClick={() => handleCategoryClick(type)} className={`border px-4 py-2 font-serif ${category === type ? "bg-white" : "bg-pink-50"}`}>
                            {type}
                        </button>
                    ))}
                    <label className="bg-pink-300 text-white text-center py-2 rounded-full cursor-pointer">
                        <input type="file" multiple hidden onChange={handleFileInput} />
                        Add
                    </label>
                    <button onClick={handleDelete} className="bg-pink-300 text-white text-center py-2 rounded-full">
                        Delete
                    </button>
                    <button onClick={handleEdit} className="bg-pink-200 text-brown-700 text-center py-2 rounded-full shadow hover:shadow-md transition">
                        Edit
                    </button>
                </div>
                <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="flex-1 p-8 grid grid-cols-3 gap-4 bg-blue-100 rounded-lg"
                >
                    {isLoading ? (
                        <p className="col-span-3 text-center">포트폴리오를 불러오는 중입니다...</p>
                    ) : (
                        items[category].map((item) => (
                            <div
                                key={item._id}
                                className="relative rounded overflow-hidden shadow-md cursor-pointer aspect-square"
                                onClick={() => handleSelect(item)}
                            >
                                <div className="absolute top-2 left-2 text-white z-10">
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
                </div>
            </div>
        </div>
    );
}