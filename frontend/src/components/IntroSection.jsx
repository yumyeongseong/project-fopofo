import { useState } from "react";
import { X } from "lucide-react";
import PdfThumbnail from "./PdfThumbnail";

export default function IntroSection({ fileUrl }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!fileUrl) {
    return (
      <div className="text-gray-400 text-sm text-center py-20 bg-white/50 rounded-lg shadow-inner">
        업로드된 자기소개서가 없습니다 😥
      </div>
    );
  }

  const cleanUrl = `${fileUrl}#toolbar=0&navpanes=0`;

  return (
    <>
      {/* 썸네일 미리보기 */}
      <div
        className="relative w-full max-w-2xl mx-auto aspect-[210/297] border border-gray-200 rounded-lg shadow-lg overflow-hidden group animate-fade-in cursor-pointer bg-gray-100"
        style={{ maxWidth: '1000px' }}
        onClick={() => setIsOpen(true)}
      >
        <PdfThumbnail file={fileUrl} />

        <div className="absolute inset-0 bg-gray-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
      </div>

      {/* 전체 보기 모달 */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition z-10 bg-black/20 rounded-full p-2"
            onClick={() => setIsOpen(false)}
          >
            <X size={32} />
          </button>
          <iframe
            src={cleanUrl}
            className="w-full max-w-[1000px] h-[90vh] rounded bg-white"
            title="document-fullscreen"
          />
        </div>
      )}
    </>
  );
}