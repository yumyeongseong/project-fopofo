// src/components/PdfThumbnail.jsx (최종 수정된 전체 코드)

import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import { FileText, Loader2 } from 'lucide-react';
// ✅ react-resize-detector에서 useResizeDetector 훅을 import 합니다.
import { useResizeDetector } from 'react-resize-detector';
import './PdfThumbnail.css';

function PdfThumbnail({ file }) {
  const [numPages, setNumPages] = useState(null);
  // ✅ useResizeDetector 훅을 사용하여 컨테이너의 width와 ref를 받아옵니다.
  const { width, ref } = useResizeDetector();

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  function onDocumentLoadError(error) {
    console.error('react-pdf 썸네일 로딩 오류:', error.message);
  }

  const loadingView = (
    <div className="thumbnail-placeholder">
      <Loader2 className="animate-spin" />
      <span>로딩중...</span>
    </div>
  );

  const errorView = (
    <div className="thumbnail-placeholder">
      <FileText size={32} />
      <span>미리보기 실패</span>
    </div>
  );

  return (
    <div ref={ref} className="pdf-thumbnail-wrapper">
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={loadingView}
        error={errorView}
        // ✅ onLoadError={onLoadError} 를 아래와 같이 수정합니다.
        // 우리가 만든 onDocumentLoadError 함수를 전달해야 합니다.
        onLoadError={onDocumentLoadError}
      >
        {numPages && width && (
          <Page
            pageNumber={1}
            width={width}
            className="pdf-page-cover"
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        )}
      </Document>
    </div>
  );
}

export default PdfThumbnail;