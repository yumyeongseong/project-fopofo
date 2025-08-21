// PortfolioSection.jsx

import { useEffect, useState } from "react";
import { LayoutGrid, ImageIcon, VideoIcon, FileText as DocumentIcon, X } from "lucide-react";
// ✅ 우리가 만든 표준 썸네일 컴포넌트를 import 합니다.
import PdfThumbnail from "./PdfThumbnail"; // 경로는 실제 파일 위치에 맞게 수정해주세요.

export default function PortfolioSection({ publicPortfolioData }) {
    const categories = [
        { key: "design", label: "Design", icon: <LayoutGrid className="w-4 h-4 mr-1" /> },
        { key: "video", label: "Video", icon: <VideoIcon className="w-4 h-4 mr-1" /> },
        { key: "document", label: "Document", icon: <DocumentIcon className="w-4 h-4 mr-1" /> },
        { key: "photo", label: "Photo", icon: <ImageIcon className="w-4 h-4 mr-1" /> },
    ];

    const [portfolioItems, setPortfolioItems] = useState({ design: [], video: [], document: [], photo: [] });
    const [selectedCategory, setSelectedCategory] = useState(categories[0].key);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        if (publicPortfolioData) {
            const fullData = { design: [], video: [], document: [], photo: [], ...publicPortfolioData };
            setPortfolioItems(fullData);
            const firstCategoryWithData = categories.find(cat => fullData[cat.key] && fullData[cat.key].length > 0);
            if (firstCategoryWithData) setSelectedCategory(firstCategoryWithData.key);
        }
    }, [publicPortfolioData]);

    const filteredItems = portfolioItems[selectedCategory] || [];

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 animate-fade-in">
            <div className="flex justify-center gap-3 sm:gap-4 mb-10 flex-wrap">
                {categories.map((cat) => (
                    <button key={cat.key} onClick={() => setSelectedCategory(cat.key)}
                        className={`flex items-center px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all border
                            ${selectedCategory === cat.key
                                ? "bg-pink-500 text-white border-pink-500 shadow-md"
                                : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                            }`}>
                        {cat.icon}
                        {cat.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {filteredItems.length === 0 ? (
                    <p className="col-span-full text-center text-gray-500 mt-8">업로드된 파일이 없습니다.</p>
                ) : (
                    filteredItems.map((item) => (
                        <div key={item._id} onClick={() => setSelectedItem(item)} 
                             className="cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 aspect-square group">
                            {item.fileType === "video" ? (
                                <video src={item.presignedUrl} className="w-full h-full object-cover" muted loop autoPlay playsInline />
                            ) : item.originalName.toLowerCase().endsWith('.pdf') ? (
                                // ✅ 표준 썸네일 컴포넌트를 사용합니다.
                                <PdfThumbnail file={item.presignedUrl} />
                            ) : (
                                <img src={item.presignedUrl} alt={item.originalName} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                            )}
                        </div>
                    ))
                )}
            </div>

            {selectedItem && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setSelectedItem(null)}>
                    <button className="absolute top-4 right-4 text-white bg-black/30 rounded-full p-2 hover:bg-black/50 transition z-50">
                        <X size={28} />
                    </button>
                    <div className="relative w-auto h-auto max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                        {selectedItem.fileType === "video" ? (
                            <video src={selectedItem.presignedUrl} className="w-auto h-[50vh] max-w-full max-h-full rounded" autoPlay controls />
                        ) : selectedItem.originalName.toLowerCase().endsWith('.pdf') ? (
                            <iframe src={`${selectedItem.presignedUrl}#toolbar=0`} className="w-[80vw] max-w-[1000px] h-[90vh] rounded" />
                        ) : (
                            <img src={selectedItem.presignedUrl} alt={selectedItem.originalName} className="w-auto h-[50vh] max-w-full max-h-full rounded" />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}