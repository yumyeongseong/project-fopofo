import { useEffect, useState } from "react";

export default function TypingIntro({ fullText }) {
    const [typedText, setTypedText] = useState("");

    useEffect(() => {
        if (!fullText || typedText === fullText) return;

        const timeout = setTimeout(() => {
            setTypedText(fullText.slice(0, typedText.length + 1));
        }, 35);

        return () => clearTimeout(timeout);
    }, [fullText, typedText]);

    return (
        <p className="text-center text-gray-700 text-[15px] whitespace-pre-line leading-relaxed min-h-[45px]">
            {typedText}
        </p>
    );
}
