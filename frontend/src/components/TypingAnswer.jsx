import { useEffect, useState } from "react";

export default function TypingAnswer({ fullText }) {
    const [typedText, setTypedText] = useState("");

    useEffect(() => {
        // fullText가 유효하지 않거나, 이미 타이핑이 완료된 상태면 아무것도 하지 않음
        if (!fullText || typedText === fullText) return;

        // 한 글자씩 타이핑을 시작합니다.
        const timeout = setTimeout(() => {
            setTypedText(fullText.slice(0, typedText.length + 1));
        }, 30); // 타이핑 속도 (밀리초 단위)

        // 컴포넌트가 언마운트되거나 fullText가 바뀔 때 timeout을 정리합니다.
        return () => clearTimeout(timeout);
    }, [fullText, typedText]); // typedText가 변경될 때마다 useEffect가 다시 실행됩니다.

    return (
        <div className="bg-blue-100 text-left text-gray-800 text-sm p-4 rounded-lg shadow mb-6 whitespace-pre-line">
            <strong>챗봇의 답변:</strong>
            <p className="mt-2">{typedText}</p>
        </div>
    );
}