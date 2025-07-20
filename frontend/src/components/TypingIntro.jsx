import { useEffect, useState } from "react";

export default function TypingIntro({ fullText }) {
    const [typedText, setTypedText] = useState("");

    useEffect(() => {
        if (!fullText || typedText === fullText) return;

        const timeout = setTimeout(() => {
            setTypedText(fullText.slice(0, typedText.length + 1));
        }, 35); // 타이핑 속도 조절

        return () => clearTimeout(timeout);
    }, [fullText, typedText]);

    return (
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line min-h-[45px]">
            {typedText}
        </p>
    );
}