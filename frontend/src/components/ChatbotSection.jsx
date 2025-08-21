import { useEffect, useRef, useState } from "react";
import { BadgeCheck, FolderKanban, UsersRound, TrendingUp, Send, Loader2, MessageSquare, ArrowUpCircle, Bot } from "lucide-react";
import TypingIntro from "./TypingIntro";
import TypingAnswer from "./TypingAnswer";
import { pythonApi } from "../services/api";

export default function ChatbotSection({ publicUserId, ownerName }) {
    const [question, setQuestion] = useState("");
    const [chatList, setChatList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const chatWrapperRef = useRef(null);
    const inputRef = useRef(null);

     const predefinedQuestions = [
        {
            full_text: "자신의 강점이 잘 드러난 경험 하나를 소개해주세요.",
            short_text: "강점이 드러난 경험"
        },
        {
            full_text: "가장 자신 있는 프로젝트 또는 작업 경험은 무엇인가요?",
            short_text: "자신 있는 프로젝트"
        },
        {
            full_text: "협업 중 기억에 남는 순간이나 갈등 해결 사례가 있나요?",
            short_text: "협업 갈등 해결 사례"
        },
        {
            full_text: "가장 힘들었지만 성장했다고 느낀 순간은 언제였나요?",
            short_text: "가장 성장한 순간"
        }
    ];

    const handleSend = async (q) => {
        const userInput = q || question.trim();
        if (!userInput || isLoading) return;

        setIsLoading(true);
        setIsTyping(true);
        setQuestion("");
        setChatList((prev) => [...prev, { role: "user", text: userInput }]);

        try {
            const res = await pythonApi.post("/chat", { query: userInput, userId: publicUserId });
            const responseText = res.data?.response || "답변을 받아오지 못했습니다.";
            setChatList((prev) => [...prev, { role: "bot", text: responseText }]);
        } catch (error) {
            const errorMsg = error.response?.data?.detail || "서버 오류가 발생했습니다.";
            setChatList((prev) => [...prev, { role: "bot", text: errorMsg }]);
        }
    };

    useEffect(() => {
        if (chatWrapperRef.current) {
            chatWrapperRef.current.scrollTop = chatWrapperRef.current.scrollHeight;
        }
    }, [chatList, isTyping]);
    
    const icons = { "강점이 드러난 경험": <BadgeCheck/>, "자신 있는 프로젝트": <FolderKanban/>, "협업 갈등 해결 사례": <UsersRound/>, "가장 성장한 순간": <TrendingUp/> };

    return (
        <div className="w-full max-w-2xl mx-auto bg-white/90 backdrop-blur-md rounded-2xl shadow-xl font-sans mt-12 overflow-hidden">
            <div ref={chatWrapperRef} className="max-h-[600px] overflow-y-auto px-8 pt-10 pb-6 space-y-6 scroll-smooth">
                <div />
                <h2 className="text-2xl font-bold text-center">나만의 챗봇</h2>
                <TypingIntro fullText={`안녕하세요 ${ownerName} 챗봇에 오신 걸 환영합니다.\n궁금한 점을 선택하거나 아래에 입력해 주세요!`} />
                
                <div className="flex flex-col gap-3">
                    {predefinedQuestions.map((q, index) => (
                        <button key={index} onClick={() => handleSend(q.full_text)}
                            className="flex items-center gap-2 justify-center w-full bg-pink-300 hover:bg-pink-400 text-white py-3 rounded-full font-semibold shadow">
                            {icons[q.short_text]} {q.short_text}
                        </button>
                    ))}
                </div>

                {/* 대화 출력 */}
                {chatList.map((chat, idx) => (
                    <div key={idx} className="text-left w-full">
                        {chat.role === "user" ? (
                            <div className="text-sm text-gray-800 font-medium mb-2 bg-gray-100 px-4 py-2 rounded-xl w-fit ml-auto flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-gray-500" />
                                {chat.text}
                            </div>
                        ) : (
                            <div className="flex flex-col items-start gap-2 max-w-[80%]">
                                    <span className="text-pink-600 font-semibold flex items-center gap-1 text-sm">
                                        <Bot className="w-4 h-4" /> 지원자
                                    </span>
                                    <div className="bg-pink-100 text-gray-800 p-3 rounded-2xl rounded-bl-none">
                                        <TypingAnswer
                                            fullText={chat.text}
                                            onFinish={() => {
                                                setIsTyping(false);
                                                setIsLoading(false);
                                                inputRef.current?.focus();
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                {isLoading && (
                    <div className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-xl w-fit flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                        답변을 생성 중입니다...
                    </div>
                )}
            </div>

            {chatList.length > 0 && (
                <div className="flex justify-center items-center gap-2 py-2">
                    <button
                        className="text-pink-500 hover:text-pink-600 text-sm flex items-center gap-1 animate-bounce"
                        onClick={() => { chatWrapperRef.current?.scrollTo({ top: 0, behavior: "smooth" }); }}
                    >
                        <ArrowUpCircle className="w-5 h-5" /> 핵심 질문으로 돌아가기
                    </button>
                </div>
            )}

            {/* 입력창 */}
            <div className="flex items-center border-t px-6 py-4 bg-white">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder={`‘${ownerName}’에게 궁금한 점을 입력해주세요!`}
                    className="flex-grow bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    disabled={isLoading}
                />
                <button className="text-blue-500 hover:text-blue-700 disabled:opacity-30" onClick={() => handleSend()} disabled={isLoading}>
                    <Send className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}