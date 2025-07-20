import { useState } from "react";

export default function PortfolioSection() {
    const [selectedItem, setSelectedItem] = useState(null);

    // ✅ 더미 데이터 (백에서 받아올 예정)
    const portfolioItems = [
        {
            id: 1,
            title: "UX 리디자인 프로젝트",
            category: "디자인",
            thumbnailUrl: "/uploads/thumb1.jpg",
            fullImageUrl: "/uploads/full1.jpg",
            description: "모바일 온보딩 UX 리디자인"
        },
        {
            id: 2,
            title: "모션그래픽 영상",
            category: "비디오",
            thumbnailUrl: "/uploads/thumb2.jpg",
            fullImageUrl: "/uploads/full2.jpg",
            description: "오프닝 모션 영상 제작"
        }
    ];

    return (
        <div className="relative">

            {/* 🖼 카드 전시 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {portfolioItems.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer"
                        onClick={() => setSelectedItem(item)}
                    >
                        <img
                            src={item.thumbnailUrl}
                            alt={item.title}
                            className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <div className="p-4">
                            <h3 className="text-lg font-semibold">{item.title}</h3>
                            <p className="text-sm text-gray-500">{item.category}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* 🔍 전체보기 모달 */}
            {selectedItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-[90%] max-w-3xl relative shadow-xl">
                        <button
                            onClick={() => setSelectedItem(null)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-black text-2xl"
                        >
                            ×
                        </button>
                        <img
                            src={selectedItem.fullImageUrl}
                            alt={selectedItem.title}
                            className="w-full max-h-[70vh] object-contain rounded"
                        />
                        <h2 className="text-xl font-bold mt-4">{selectedItem.title}</h2>
                        <p className="text-sm text-gray-600 mt-2">{selectedItem.description}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
