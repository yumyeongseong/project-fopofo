import { useEffect, useState } from "react";
// ✅ 1. 필요한 라이브러리와 컴포넌트를 가져옵니다.
import { nodeApi } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import * as pdfjsLib from "pdfjs-dist";
import { GlobalWorkerOptions } from "pdfjs-dist";

// PDF.js 워커 경로를 설정합니다.
GlobalWorkerOptions.workerSrc = `/pdf.worker.mjs`;

// ✅ PDF 썸네일을 생성하는 별도의 컴포넌트
const PdfThumbnail = ({ fileUrl, alt }) => {
    const [thumbUrl, setThumbUrl] = useState(null);

    useEffect(() => {
        const generateThumb = async () => {
            try {
                const pdf = await pdfjsLib.getDocument(fileUrl).promise;
                const page = await pdf.getPage(1);
                const viewport = page.getViewport({ scale: 0.8 });
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                await page.render({ canvasContext: context, viewport }).promise;
                setThumbUrl(canvas.toDataURL());
            } catch (error) {
                console.error("PDF 썸네일 생성 실패:", error);
            }
        };
        if (fileUrl) generateThumb();
    }, [fileUrl]);

    return thumbUrl ? (
        <img src={thumbUrl} alt={alt} className="w-full h-auto object-contain rounded" />
    ) : (
        // 로딩 중이거나 실패 시 보여줄 대체 UI
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded">
            <p className="text-sm text-gray-500">PDF 미리보기 생성 중...</p>
        </div>
    );
};


export default function PortfolioSection() {
    // ✅ 2. portfolioItems를 비어 있는 상태로 시작합니다.
    const [portfolioItems, setPortfolioItems] = useState({ Design: [], Video: [], Document: [], Photo: [] });
    const [selectedCategory, setSelectedCategory] = useState("Design");
    const [selectedItem, setSelectedItem] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { isAuthenticated } = useAuth();

    const categories = ["Design", "Video", "Document", "Photo"];

    // ✅ 3. useEffect를 사용하여 백엔드에서 데이터를 불러옵니다.
    useEffect(() => {
        // 로그인 상태가 아니면 데이터를 불러오지 않습니다.
        if (!isAuthenticated) {
            setIsLoading(false);
            return;
        }

        const fetchAllPortfolioItems = async () => {
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

                setPortfolioItems({
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
        };

        fetchAllPortfolioItems();
    }, [isAuthenticated]); // 로그인 상태가 변경될 때도 데이터를 다시 불러옵니다.


    // 현재 선택된 카테고리의 아이템들만 필터링합니다.
    const filteredItems = portfolioItems[selectedCategory] || [];

    // --- 이 아래의 return 문은 UI 구조 변경 없이 100% 동일합니다. ---
    return (
        <div className="relative">
            {/* 🗂 카테고리 버튼 */}
            <div className="flex justify-center mb-6 flex-wrap gap-3">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full shadow-sm font-medium transition ${selectedCategory === category
                            ? "bg-[#f48ca2] text-white"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* 🖼 포트폴리오 썸네일 카드 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {isLoading ? (
                    <p>로딩 중...</p>
                ) : filteredItems.length === 0 ? (
                    <p className="col-span-full text-center text-gray-500">업로드된 파일이 없습니다.</p>
                ) : (
                    filteredItems.map((item) => (
                        <div
                            key={item._id}
                            className="cursor-pointer group"
                            onClick={() => setSelectedItem(item)}
                        >
                            {/* ✅ 4. 파일 타입에 따라 썸네일을 다르게 표시합니다. */}
                            {item.fileType === "video" ? (
                                <video src={item.presignedUrl} className="w-full h-48 object-cover rounded shadow group-hover:shadow-lg transition" />
                            ) : item.originalName.toLowerCase().endsWith('.pdf') ? (
                                <PdfThumbnail fileUrl={item.presignedUrl} alt={item.originalName} />
                            ) : (
                                <img
                                    src={item.presignedUrl}
                                    alt={item.originalName}
                                    className="w-full h-48 object-cover rounded shadow group-hover:shadow-lg transition"
                                />
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* 🔍 전체보기 모달 */}
            {selectedItem && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="relative">
                        <button
                            onClick={() => setSelectedItem(null)}
                            className="absolute top-[-30px] right-0 text-white text-3xl"
                        >
                            ×
                        </button>

                        {/* ✅ 5. 모달에서도 파일 타입에 따라 다르게 표시합니다. */}
                        {selectedItem.fileType === "video" ? (
                            <video
                                src={selectedItem.presignedUrl}
                                controls
                                autoPlay
                                className="max-w-[90vw] max-h-[90vh] object-contain rounded"
                            />
                        ) : selectedItem.originalName.toLowerCase().endsWith('.pdf') ? (
                            <iframe
                                src={`${selectedItem.presignedUrl}#toolbar=0`}
                                title={selectedItem.originalName}
                                className="w-[80vw] h-[90vh] rounded bg-white"
                            />
                        ) : (
                            <img
                                src={selectedItem.presignedUrl}
                                alt={selectedItem.originalName}
                                className="max-w-[90vw] max-h-[90vh] object-contain rounded"
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}