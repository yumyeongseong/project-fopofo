import { useEffect, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { GlobalWorkerOptions } from "pdfjs-dist";

GlobalWorkerOptions.workerSrc = `/pdf.worker.mjs`;

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
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded">
            <p className="text-sm text-gray-500">PDF 미리보기 생성 중...</p>
        </div>
    );
};

export default function PortfolioSection({ portfolio }) {
    const [selectedCategory, setSelectedCategory] = useState("Design");
    const [selectedItem, setSelectedItem] = useState(null);

    const categories = ["Design", "Video", "Document", "Photo"];

    if (!portfolio || portfolio.length === 0) {
        return (
            <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md border mt-10">
                <h2 className="text-xl font-semibold mb-4">📁 포트폴리오</h2>
                <p>업로드된 포트폴리오 파일이 없습니다.</p>
            </div>
        );
    }

    const filteredItems = portfolio.filter(
        (item) => item.fileType === selectedCategory.toLowerCase()
    );

    return (
        <div className="relative px-6 pb-20">
            {/* 카테고리 버튼 */}
            <div className="flex justify-center mb-8 flex-wrap gap-4">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-5 py-2 rounded-full font-medium text-sm transition shadow-sm ${selectedCategory === category
                            ? "bg-[#f48ca2] text-white"
                            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* 썸네일 목록 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                    <div
                        key={item.filePath}
                        onClick={() => setSelectedItem(item)}
                        className="cursor-pointer group bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
                    >
                        {item.fileType === "video" ? (
                            <video src={item.filePath} className="w-full h-48 object-cover" />
                        ) : item.originalName.toLowerCase().endsWith(".pdf") ? (
                            <PdfThumbnail fileUrl={item.filePath} alt={item.originalName} />
                        ) : (
                            <img src={item.filePath} alt={item.originalName} className="w-full h-48 object-cover" />
                        )}
                    </div>
                ))}
            </div>

            {/* 전체보기 모달 */}
            {selectedItem && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="relative">
                        <button
                            onClick={() => setSelectedItem(null)}
                            className="absolute top-[-30px] right-0 text-white text-3xl"
                        >
                            ×
                        </button>

                        {selectedItem.fileType === "video" ? (
                            <video
                                src={selectedItem.filePath}
                                controls
                                autoPlay
                                className="max-w-[90vw] max-h-[90vh] object-contain rounded"
                            />
                        ) : selectedItem.originalName.toLowerCase().endsWith(".pdf") ? (
                            <iframe
                                src={`${selectedItem.filePath}#toolbar=0`}
                                title={selectedItem.originalName}
                                className="w-[80vw] h-[90vh] rounded bg-white"
                            />
                        ) : (
                            <img
                                src={selectedItem.filePath}
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
