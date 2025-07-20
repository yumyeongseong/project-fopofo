import { useEffect, useState } from "react";

export default function PortfolioSection() {
    const [portfolioItems, setPortfolioItems] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("Design");
    const [selectedItem, setSelectedItem] = useState(null);

    const categories = ["Design", "Video", "Document", "Photo"];

    useEffect(() => {
        const dummyData = [
            {
                id: 1,
                title: "UX 리디자인 프로젝트",
                category: "Design",
                thumbnailUrl: "/design-img.jpg",
                fullImageUrl: "/design-img.jpg",
            },
            {
                id: 2,
                title: "오프닝 모션그래픽 영상",
                category: "Video",
                thumbnailUrl: "/video-thumb.jpg", // 썸네일은 이미지
                fullImageUrl: "/Mac Miller - Blue World.mp4", // 실제 영상 파일
            },
            {
                id: 3,
                title: "포트폴리오 PDF 문서",
                category: "Document",
                thumbnailUrl: "/document-thumb.jpg", // 썸네일 이미지
                fullImageUrl: "/dummy.pdf", // 실제 PDF 파일
            },
            {
                id: 4,
                title: "제주 풍경 사진",
                category: "Photo",
                thumbnailUrl: "/Photo-img.jpeg",
                fullImageUrl: "/Photo-img.jpeg",
            },
        ];
        setPortfolioItems(dummyData);
    }, []);

    const filteredItems = portfolioItems.filter(
        (item) => item.category === selectedCategory
    );

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
                {filteredItems.map((item) => (
                    <div
                        key={item.id}
                        className="cursor-pointer"
                        onClick={() => setSelectedItem(item)}
                    >
                        {item.category === "Video" ? (
                            <img
                                src={item.thumbnailUrl}
                                alt="비디오 썸네일"
                                className="w-full h-auto object-cover rounded"
                            />
                        ) : item.category === "Document" ? (
                            <img
                                src={item.thumbnailUrl}
                                alt="PDF 썸네일"
                                className="w-full h-auto object-contain rounded"
                            />
                        ) : (
                            <img
                                src={item.thumbnailUrl}
                                alt="썸네일"
                                className="w-full h-auto object-contain rounded"
                                onError={(e) => {
                                    e.target.src = "/placeholder.png";
                                }}
                            />
                        )}
                    </div>
                ))}
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

                        {selectedItem.fullImageUrl.endsWith(".mp4") ? (
                            <video
                                src={selectedItem.fullImageUrl}
                                controls
                                className="max-w-[90vw] max-h-[90vh] object-contain rounded"
                            />
                        ) : selectedItem.fullImageUrl.endsWith(".pdf") ? (
                            <iframe
                                src={selectedItem.fullImageUrl}
                                title="PDF 미리보기"
                                className="w-[90vw] h-[90vh] rounded bg-white"
                            />
                        ) : (
                            <img
                                src={selectedItem.fullImageUrl}
                                alt="전체보기 이미지"
                                className="max-w-[90vw] max-h-[90vh] object-contain rounded"
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
