import { useState } from "react";

// 👇 1. props로 portfolio 데이터를 받도록 수정합니다.
export default function PortfolioSection({ portfolio }) {
  const [selectedItem, setSelectedItem] = useState(null);

  // 👇 2. 더미 데이터 대신, props로 받은 portfolio 데이터가 있는지 확인하고 표시합니다.
  if (!portfolio || portfolio.length === 0) {
    return (
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md border mt-10">
        <h2 className="text-xl font-semibold mb-4">📁 포트폴리오</h2>
        <p>포트폴리오 데이터가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* 🖼 카드 전시 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* 👇 3. portfolioItems.map을 portfolio.map으로 변경하고, 데이터 필드를 맞춰줍니다. */}
        {portfolio.map((item) => (
          <div
            key={item.id} // item.id는 데이터베이스의 고유 ID를 사용해야 합니다.
            className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer"
            onClick={() => setSelectedItem(item)}
          >
            <img
              src={item.filePath}
              alt={item.originalName}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{item.originalName}</h3>
              <p className="text-sm text-gray-500">{item.fileType}</p>
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
              src={selectedItem.filePath}
              alt={selectedItem.originalName}
              className="w-full max-h-[70vh] object-contain rounded"
            />
            <h2 className="text-xl font-bold mt-4">{selectedItem.originalName}</h2>
            <p className="text-sm text-gray-600 mt-2">{selectedItem.description || selectedItem.fileType}</p>
          </div>
        </div>
      )}
    </div>
  );
}