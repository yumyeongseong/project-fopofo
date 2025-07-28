import { useState } from "react";
import { X } from "lucide-react";

export default function IntroSection({ fileUrl }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!fileUrl) {
    return (
      <div className="text-gray-400 text-sm text-center py-20">
        문서를 불러올 수 없습니다 😥
      </div>
    );
  }

  const cleanUrl = `${fileUrl}#toolbar=0`;

  return (
    <>
      {/* 썸네일 미리보기 */}
      <div className="relative w-full max-w-[800px] group">
        <div
          className="absolute inset-0 z-10 cursor-pointer bg-transparent group-hover:bg-white/10 transition"
          onClick={() => setIsOpen(true)}
        />
        <iframe
          src={cleanUrl}
          className="w-full h-[500px] border border-gray-200 rounded shadow"
          title="document-preview"
        />
      </div>

      {/* 전체 보기 모달 */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-white flex items-center justify-center p-6">
          <button
            className="absolute top-6 right-6 text-gray-600 hover:text-black transition"
            onClick={() => setIsOpen(false)}
          >
            <X size={32} />
          </button>
          <iframe
            src={cleanUrl}
            className="w-full max-w-[1000px] h-[90vh] rounded"
            title="document-fullscreen"
          />
        </div>
      )}
    </>
  );
}
