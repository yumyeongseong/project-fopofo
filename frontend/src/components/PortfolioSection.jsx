import { useState } from "react";
import { LayoutGrid, ImageIcon, VideoIcon, FileText, X } from "lucide-react";

export default function PortfolioSection({ portfolio = [] }) {
    const [selectedCategory, setSelectedCategory] = useState("design");
    const [selectedFile, setSelectedFile] = useState(null);

    const categories = [
        { key: "design", label: "Design", icon: <LayoutGrid className="w-4 h-4 mr-1" /> },
        { key: "photo", label: "Photo", icon: <ImageIcon className="w-4 h-4 mr-1" /> },
        { key: "video", label: "Video", icon: <VideoIcon className="w-4 h-4 mr-1" /> },
        { key: "documents", label: "Documents", icon: <FileText className="w-4 h-4 mr-1" /> },
    ];

    // 백엔드 없을 때 사용할 더미 포트폴리오
    const dummyData = [
        {
            fileType: "design",
            filePath: "https://picsum.photos/id/237/300/200",
        },
        {
            fileType: "photo",
            filePath: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2400&q=80",
        },
        {
            fileType: "video",
            filePath: "https://www.w3schools.com/html/mov_bbb.mp4",
        },
        {
            fileType: "documents",
            filePath: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
            thumbnailPath: "https://mozilla.github.io/pdf.js/web/images/logo.png"
        },
    ];

    const filtered = (portfolio.length > 0 ? portfolio : dummyData).filter(
        (item) => item.fileType === selectedCategory
    );

    return (
        <div className="w-full max-w-[1400px] mx-auto px-6 py-12">
            <div className="flex justify-center gap-6 mb-10 flex-wrap">
                {categories.map((cat) => (
                    <button
                        key={cat.key}
                        onClick={() => setSelectedCategory(cat.key)}
                        className={`flex items-center px-5 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat.key
                            ? "bg-pink-500 text-white shadow"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                    >
                        {cat.icon}
                        {cat.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {filtered.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => setSelectedFile(item)}
                        className="cursor-pointer border rounded overflow-hidden shadow hover:shadow-lg transition"
                    >
                        {item.fileType === "video" ? (
                            <video src={item.filePath} className="w-full h-[200px] object-cover" muted />
                        ) : item.fileType === "documents" ? (
                            item.thumbnailPath ? (
                                <img
                                    src={item.thumbnailPath}
                                    alt="pdf-thumbnail"
                                    className="w-full h-[200px] object-cover"
                                />
                            ) : (
                                <div className="w-full h-[200px] flex items-center justify-center bg-gray-100 text-sm text-gray-500">
                                    PDF 미리보기 없음
                                </div>
                            )
                        ) : (
                            <img
                                src={item.filePath}
                                alt="preview"
                                className="w-full h-[200px] object-cover"
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* 전체 보기 모달 */}
            {selectedFile && (
                <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-6">
                    <button
                        className="absolute top-8 right-8 text-white"
                        onClick={() => setSelectedFile(null)}
                    >
                        <X size={36} />
                    </button>

                    <div className="max-w-[1000px] w-full max-h-[90vh]">
                        {selectedFile.fileType === "video" ? (
                            <video
                                src={selectedFile.filePath}
                                className="w-full max-h-[90vh]"
                                autoPlay
                                controls
                            />
                        ) : selectedFile.fileType === "documents" ? (
                            <iframe
                                src={`${selectedFile.filePath}#toolbar=0`}
                                className="w-full h-[90vh] rounded bg-white"
                            />
                        ) : (
                            <img
                                src={selectedFile.filePath}
                                alt="full-view"
                                className="w-full h-auto max-h-[90vh] object-contain"
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
