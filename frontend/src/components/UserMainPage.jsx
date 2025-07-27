import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CategoryButtons from "./CategoryButtons";
import IntroSection from "./IntroSection";
import PortfolioSection from "./PortfolioSection";
import ChatbotSection from "./ChatbotSection";
import ScrollToTopButton from "./ScrollToTopButton";
import ThemePanel from "./ThemePanel";
import { Paintbrush } from "lucide-react";
import { nodeApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function UserMainPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState(null);
    const [font, setFont] = useState("font-serif");
    const [background, setBackground] = useState("bg-gradient-to-b from-blue-100 to-blue-200");
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    
    // ✅ 1. '이력서' 관련 상태 변수(showResume, resumeUrl)를 삭제합니다.
    const [showIntro, setShowIntro] = useState(false);
    const [introUrl, setIntroUrl] = useState(null);

    const toggleSection = (sectionName) => {
        setActiveSection((prevSection) => (prevSection === sectionName ? null : sectionName));
    };

    // ✅ 2. '자기소개서' 파일만 불러오도록 로직을 단순화합니다.
    useEffect(() => {
        if (activeSection === "intro") {
            setShowIntro(true);

            const fetchIntroFile = async () => {
                try {
                    // 자기소개서/이력서는 현재 'resume' 타입으로 저장되므로 그대로 호출합니다.
                    const response = await nodeApi.get('/user-upload/resume');
                    if (response.data && response.data.data.presignedUrl) {
                        setIntroUrl(response.data.data.presignedUrl);
                    }
                } catch (err) {
                    if (err.response?.status === 404) {
                        console.log("업로드된 자기소개서가 없습니다.");
                    } else {
                        console.error("자기소개서 URL 불러오기 실패:", err);
                    }
                    setIntroUrl(null);
                }
            };

            fetchIntroFile();

        } else {
            setShowIntro(false);
        }
    }, [activeSection]);

    return (
        <div className={`min-h-screen pt-[96px] ${background} ${font} relative transition-all duration-300 overflow-x-hidden`}>
            <ThemePanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                setFont={setFont}
                setBackground={setBackground}
            />

            <div className="fixed top-6 left-0 right-0 z-40">
                <CategoryButtons activeSection={activeSection} toggleSection={toggleSection} />
            </div>

            {!activeSection && (
                <div className="flex flex-col items-center justify-center mt-40 animate-fade-in">
                    <h1 className="text-3xl sm:text-5xl tracking-widest text-gray-800 text-center leading-snug">
                        Portfolio web<br />
                        for <span className="font-bold">{user ? user.nickname : '...'}</span>
                    </h1>
                </div>
            )}

            {activeSection === "chatbot" && (
                <div className="flex items-center justify-center min-h-screen pt-24">
                    <ChatbotSection />
                </div>
            )}

            {activeSection === "portfolio" && (
                <div className="mt-10">
                    <PortfolioSection />
                </div>
            )}

            {activeSection === "intro" && (
                // ✅ 3. 남은 '자기소개서' 섹션이 중앙에 오도록 그리드 설정을 수정합니다.
                <div className="grid grid-cols-1 justify-items-center gap-6 px-6 mt-10">
                    <div className={`transition-opacity duration-500 w-full max-w-2xl ${showIntro ? 'opacity-100' : 'opacity-0'}`}>
                        <IntroSection type="intro" fileUrl={introUrl} />
                    </div>
                    {/* ✅ 4. '이력서' 섹션을 렌더링하는 div를 완전히 삭제합니다. */}
                </div>
            )}

            <ScrollToTopButton />

            <button
                onClick={() => setIsPanelOpen(prev => !prev)}
                className={`fixed bottom-6 right-6 w-20 h-20 bg-white text-gray-700 text-xs font-medium rounded-full
        flex flex-col items-center justify-center transition duration-300 z-50
        hover:shadow-lg hover:ring-2 hover:ring-blue-200
        ${isPanelOpen ? "ring-2 ring-blue-400 shadow-inner" : "shadow-md"}`}
            >
                <Paintbrush className="w-5 h-5 mb-1" />
                테마
            </button>
        </div>
    );
}