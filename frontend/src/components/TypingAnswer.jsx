import { useEffect, useState } from "react";

export default function TypingAnswer({ fullText }) {
    const [typedText, setTypedText] = useState("");

    useEffect(() => {
        if (!fullText || typedText === fullText) return;

        const timeout = setTimeout(() => {
            setTypedText(fullText.slice(0, typedText.length + 1));
        }, 25); // 타이핑 속도 (적당히 중간값)

        return () => clearTimeout(timeout);
    }, [fullText, typedText]);

    return (
        <div className="bg-blue-100 text-left text-gray-800 text-sm p-4 rounded-lg shadow mb-6 whitespace-pre-line">
            <strong>홍길동 챗봇의 답변:</strong>
            <p className="mt-2">{typedText}</p>
        </div>
    );
}
