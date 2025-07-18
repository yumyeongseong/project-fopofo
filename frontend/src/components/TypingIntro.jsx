import { useEffect, useState } from "react";

export default function TypingIntro({ fullText }) {
    const [typedText, setTypedText] = useState("");

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            setTypedText((prev) => prev + fullText.charAt(index));
            index++;
            if (index >= fullText.length) {
                clearInterval(interval);
            }
        }, 25); // 타이핑 속도 조절

        return () => clearInterval(interval);
    }, [fullText]);

    return (
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line min-h-[45px]">
            {typedText}
        </p>
    );
}