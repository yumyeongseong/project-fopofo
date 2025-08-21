export default function PortfolioItem({ fileType, filePath, onClick }) {
    return (
        <div
            className="relative w-full h-[200px] rounded overflow-hidden shadow cursor-pointer bg-white group"
            onClick={onClick}
        >
            {/* 이미지 & 사진 */}
            {(fileType === "design" || fileType === "photo") && (
                <img
                    src={filePath}
                    alt="preview"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
            )}

            {/* 영상 */}
            {fileType === "video" && (
                <video
                    src={filePath}
                    className="w-full h-full object-cover"
                    muted
                    autoPlay
                    loop
                />
            )}

            {/* 문서 */}
            {fileType === "documents" && (
                <iframe
                    src={`${filePath}#toolbar=0`}
                    className="w-full h-full"
                    title="pdf"
                />
            )}
        </div>
    );
}
