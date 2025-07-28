import { useState, useEffect, useRef } from "react";

export default function TypingAnswer({ fullText, onFinish }) {
    const [typedText, setTypedText] = useState("");
    const containerRef = useRef();

    useEffect(() => {
        if (!fullText || typedText === fullText) return;

        const timeout = setTimeout(() => {
            const next = fullText.slice(0, typedText.length + 1);
            setTypedText(next);
            containerRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });

            if (next === fullText) onFinish?.();
        }, 25);

        return () => clearTimeout(timeout);
    }, [fullText, typedText, onFinish]);

    return (
        <div
            ref={containerRef}
            className="bg-[#fff3f7] text-gray-800 text-sm px-4 py-3 rounded-xl shadow-sm whitespace-pre-line leading-relaxed"
        >
            {typedText}
        </div>
    );
}
