import { useState, useEffect, useRef } from "react";

export default function TypingAnswer({ fullText, onFinish }) {
  const [typedText, setTypedText] = useState("");
  const containerRef = useRef(null); // 스크롤을 위한 ref

  useEffect(() => {
    // 텍스트가 없거나 이미 타이핑이 완료되면 종료
    if (!fullText || typedText === fullText) {
      if (typedText === fullText) {
        onFinish?.(); // 완료 시 onFinish 콜백 호출
      }
      return;
    }

    const timeout = setTimeout(() => {
      const nextText = fullText.slice(0, typedText.length + 1);
      setTypedText(nextText);

      // 타이핑 중에 자동으로 스크롤
      containerRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });

    }, 25); // 타이핑 속도

    return () => clearTimeout(timeout);
  }, [fullText, typedText, onFinish]);

  return (
    <div
      ref={containerRef}
      // ✅ [디자인] 새로운 테마의 스타일 적용
      className="bg-[#fff3f7] text-gray-800 text-sm px-4 py-3 rounded-xl shadow-sm whitespace-pre-line leading-relaxed"
    >
      {typedText}
    </div>
  );
}