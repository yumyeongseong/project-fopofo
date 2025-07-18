import { useEffect, useState } from "react";

export default function TypingAnswer({ fullText }) {
    const [typedText, setTypedText] = useState("");

    useEffect(() => {
        if (!fullText) return;
        let index = 0;
        const interval = setInterval(() => {
            setTypedText((prev) => prev + fullText.charAt(index));
            index++;
            if (index >= fullText.length) {
                clearInterval(interval);
            }
        }, 20);

        return () => clearInterval(interval);
    }, [fullText]);

    return (
        <div className="bg-blue-100 text-left text-gray-800 text-sm p-4 rounded-lg shadow mb-6 whitespace-pre-line">
            <strong>홍길동 챗봇의 답변:</strong>
            <p className="mt-2">{typedText}</p>
        </div>
    );
}