import { useState } from "react";
import { X } from "lucide-react";
import { GlobalWorkerOptions } from 'pdfjs-dist';

// ✅ [기능] 배포 환경에서 PDF 렌더링을 위한 필수 설정 코드
GlobalWorkerOptions.workerSrc = `/pdf.worker.mjs`;

export default function IntroSection({ fileUrl }) {
  // ✅ [신규 기능] 모달 창 상태 관리를 위한 useState
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
      {/* ✅ [신규 기능] 썸네일 미리보기 */}
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

      {/* ✅ [신규 기능] 전체 보기 모달 */}
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