import { useState } from "react";
import {
    BadgeCheck,
    FolderKanban,
    UsersRound,
    TrendingUp,
    Send,
} from "lucide-react";

import TypingIntro from "./TypingIntro";
import TypingAnswer from "./TypingAnswer";

export default function ChatbotSection() {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showButtons, setShowButtons] = useState(true);

    const handleSend = async (q) => {
        const userInput = q || question.trim();
        if (!userInput) return;

        setIsLoading(true);
        setShowButtons(false);
        setAnswer("");

        // ✨ 실제 API 요청 대신 가짜 응답
        await new Promise((r) => setTimeout(r, 800));
        setAnswer(`◆ ${userInput}에 대한 답변입니다. 실제 GPT 응답이 여기에 표시됩니다.`);

        setIsLoading(false);
        setShowButtons(true);
        setQuestion("");
    };

    return (
        <div className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-md rounded-2xl px-8 pt-8 pb-12 shadow-2xl text-center space-y-6 font-sans text-[15px] tracking-tight">
            <h2 className="text-2xl font-bold text-black tracking-wide">나만의 챗봇</h2>

            {/* ⬇️ 타이핑 안내문구 */}
            <TypingIntro
                fullText={`안녕하세요 홍길동 챗봇에 오신 걸 환영합니다.\n궁금한 점을 선택하거나 아래에 입력해 주세요!`}
            />

            {/* 질문 버튼 */}
            {showButtons && (
                <div className="flex flex-col gap-3 mb-12">
                    <button
                        className="flex items-center gap-2 justify-center w-full bg-pink-300 hover:bg-pink-400 text-white py-3 rounded-full shadow transition font-semibold"
                        onClick={() => handleSend("강점이 드러난 경험")}
                    >
                        <BadgeCheck className="w-5 h-5" />
                        강점이 드러난 경험
                    </button>

                    <button
                        className="flex items-center gap-2 justify-center w-full bg-pink-300 hover:bg-pink-400 text-white py-3 rounded-full shadow transition font-semibold"
                        onClick={() => handleSend("자신 있는 프로젝트")}
                    >
                        <FolderKanban className="w-5 h-5" />
                        자신 있는 프로젝트
                    </button>

                    <button
                        className="flex items-center gap-2 justify-center w-full bg-pink-300 hover:bg-pink-400 text-white py-3 rounded-full shadow transition font-semibold"
                        onClick={() => handleSend("협업 갈등 해결 사례")}
                    >
                        <UsersRound className="w-5 h-5" />
                        협업 갈등 해결 사례
                    </button>

                    <button
                        className="flex items-center gap-2 justify-center w-full bg-pink-300 hover:bg-pink-400 text-white py-3 rounded-full shadow transition font-semibold"
                        onClick={() => handleSend("가장 성장한 순간")}
                    >
                        <TrendingUp className="w-5 h-5" />
                        가장 성장한 순간
                    </button>
                </div>
            )}

            {/* 답변 출력 */}
            {answer && <TypingAnswer fullText={answer} />}

            {/* 입력창 */}
            <div className="flex items-center border rounded-full px-4 py-2 shadow-inner bg-white">
                <input
                    type="text"
                    placeholder="‘홍길동’에게 궁금한 점을 입력해주세요!"
                    className="flex-grow bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button
                    className="text-blue-500 hover:text-blue-700 disabled:opacity-30"
                    disabled={isLoading}
                    onClick={() => handleSend()}
                >
                    <Send className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}