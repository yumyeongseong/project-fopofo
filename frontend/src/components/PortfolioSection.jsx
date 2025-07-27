import { useEffect, useState } from "react";
import { nodeApi } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import * as pdfjsLib from "pdfjs-dist";
import { GlobalWorkerOptions } from "pdfjs-dist";
import { FiFileText } from "react-icons/fi";

// PDF.js 워커 경로를 설정합니다.
GlobalWorkerOptions.workerSrc = `/pdf.worker.mjs`;

// PDF 썸네일을 생성하는 별도의 컴포넌트
const PdfThumbnail = ({ fileUrl, alt }) => {
    const [thumbUrl, setThumbUrl] = useState(null);

    useEffect(() => {
        const generateThumb = async () => {
            try {
                const pdf = await pdfjsLib.getDocument({ url: fileUrl }).promise;
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
        <img src={thumbUrl} alt={alt} className="w-full h-48 object-cover rounded shadow group-hover:shadow-lg transition" />
    ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded">
            <p className="text-sm text-gray-500">PDF 미리보기 생성 중...</p>
        </div>
    );
};


export default function PortfolioSection({ publicPortfolioData }) {
    // ✅ 1. 데이터 키는 소문자(key), 화면에 보이는 이름은 대문자(label)로 분리하여 관리합니다. (대소문자 문제 해결)
    const categories = [
        { key: "design", label: "Design" },
        { key: "video", label: "Video" },
        { key: "document", label: "Document" },
        { key: "photo", label: "Photo" }
    ];

    const [portfolioItems, setPortfolioItems] = useState({ design: [], video: [], document: [], photo: [] });
    const [selectedCategory, setSelectedCategory] = useState(categories[0].key);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        // --- 공개 페이지용 데이터 처리 로직 ---
        if (publicPortfolioData) {
            const fullData = { design: [], video: [], document: [], photo: [], ...publicPortfolioData };
            setPortfolioItems(fullData);
            // 데이터가 있는 첫 번째 카테고리를 찾아 자동으로 선택
            const firstCategoryWithData = categories.find(cat => fullData[cat.key] && fullData[cat.key].length > 0);
            if (firstCategoryWithData) {
                setSelectedCategory(firstCategoryWithData.key);
            }
            setIsLoading(false);
            return;
        }

        // --- 로그인한 사용자용 데이터 처리 로직 ---
        if (isAuthenticated) {
            const fetchAllPortfolioItems = async () => {
                setIsLoading(true);
                try {
                    const endpoints = { design: '/user-upload/designs', video: '/user-upload/videos', document: '/user-upload/documents', photo: '/user-upload/photos' };
                    const requests = Object.keys(endpoints).map(key => nodeApi.get(endpoints[key]));
                    const responses = await Promise.all(requests);

                    const fetchedData = {
                        design: responses[0].data.data,
                        video: responses[1].data.data,
                        document: responses[2].data.data,
                        photo: responses[3].data.data,
                    };
                    setPortfolioItems(fetchedData);
                    
                    const firstCategoryWithData = categories.find(cat => fetchedData[cat.key] && fetchedData[cat.key].length > 0);
                    if (firstCategoryWithData) {
                        setSelectedCategory(firstCategoryWithData.key);
                    }
                } catch (error) {
                    console.error("포트폴리오 데이터를 불러오는 중 오류 발생:", error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchAllPortfolioItems();
        } else {
            setIsLoading(false);
        }
    }, [isAuthenticated, publicPortfolioData]);


    const filteredItems = portfolioItems[selectedCategory] || [];

    return (
        // ✅ 2. 클릭 문제를 해결하기 위해 z-index를 추가합니다.
        <div className="relative z-10">
            {/* ✅ 3. 위치 조정을 위해 mt-8 (margin-top)을 추가합니다. */}
            <div className="flex justify-center mt-8 mb-6 flex-wrap gap-3">
                {categories.map((cat) => (
                    <button
                        key={cat.key}
                        onClick={() => setSelectedCategory(cat.key)}
                        className={`px-4 py-2 rounded-full shadow-sm font-medium transition ${selectedCategory === cat.key
                            ? "bg-[#f48ca2] text-white"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                            }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {isLoading ? (
                    <p>로딩 중...</p>
                ) : filteredItems.length === 0 ? (
                    <p className="col-span-full text-center text-gray-500">업로드된 파일이 없습니다.</p>
                ) : (
                    filteredItems.map((item) => (
                        <div key={item._id} className="cursor-pointer group" onClick={() => setSelectedItem(item)}>
                            {item.fileType === "video" ? (
                                <video src={item.presignedUrl} className="w-full h-48 object-cover rounded shadow group-hover:shadow-lg transition" />
                            ) : item.originalName.toLowerCase().endsWith('.pdf') ? (
                                <PdfThumbnail fileUrl={item.presignedUrl} alt={item.originalName} />
                            ) : (
                                <img src={item.presignedUrl} alt={item.originalName} className="w-full h-48 object-cover rounded shadow group-hover:shadow-lg transition" />
                            )}
                        </div>
                    ))
                )}
            </div>

            {selectedItem && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    {/* 1. 팝업창 내용물을 감싸는 div 추가 */}
                    <div className="relative w-auto h-auto">
                        {/* 2. 버튼 위치를 오른쪽 위, 안쪽으로 이동하고 배경 추가 */}
                        <button
                            onClick={() => setSelectedItem(null)}
                            className="absolute top-2 right-2 text-white bg-black/50 rounded-full w-8 h-8 flex items-center justify-center text-xl z-10"
                        >
                            ×
                        </button>

                        {selectedItem.fileType === "video" ? (
                            <video
                                src={selectedItem.presignedUrl}
                                controls autoPlay
                                className="max-w-[70vw] max-h-[70vh] object-contain rounded"
                            />
                        ) : selectedItem.originalName.toLowerCase().endsWith('.pdf') ? (
                            <iframe
                                src={`${selectedItem.presignedUrl}#toolbar=0`}
                                title={selectedItem.originalName}
                                className="w-[70vw] h-[70vh] rounded bg-white" // 높이 조절
                            />
                        ) : (
                            <img
                                src={selectedItem.presignedUrl}
                                alt={selectedItem.originalName}
                                className="max-w-[70vw] max-h-[70vh] object-contain rounded"
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}