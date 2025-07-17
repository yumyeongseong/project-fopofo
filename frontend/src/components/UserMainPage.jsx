import { useState } from "react";
import CategoryButtons from "./CategoryButtons";
import IntroSection from "./IntroSection";
import PortfolioSection from "./PortfolioSection";
import ChatbotSection from "./ChatbotSection";
import ScrollToTopButton from "./ScrollToTopButton";
import ThemePanel from "./ThemePanel";

export default function UserMainPage() {
    const [activeSection, setActiveSection] = useState(null);
    const [font, setFont] = useState("font-serif");
    const [background, setBackground] = useState("bg-gradient-to-b from-blue-100 to-blue-200");
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    const toggleSection = (sectionName) => {
        setActiveSection((prev) => (prev === sectionName ? null : sectionName));
    };

    return (
        <div className={`min-h-screen ${background} text-gray-800 ${font} relative transition-all duration-300`}>
            {/* 🎨 테마 패널 */}
            <ThemePanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                setFont={setFont}
                setBackground={setBackground}
            />

            {/* 🔘 상단 고정 버튼 */}
            <div className="fixed top-6 left-0 right-0 z-40">
                <CategoryButtons activeSection={activeSection} toggleSection={toggleSection} />
            </div>

            {/* 🎯 메인 텍스트 (중앙 아래 위치) */}
            {activeSection === "chatbot" && (
                <div className="flex items-center justify-center min-h-screen pt-24">
                    <ChatbotSection />
                </div>
            )}

            {/* 📂 섹션 출력 */}
            <div className="mt-10">
                {activeSection === "intro" && <IntroSection />}
                {activeSection === "portfolio" && <PortfolioSection />}

                {/* ✅ 챗봇은 항상 중앙 정렬 */}

            </div>

            {/* ⬆️ Top 버튼 */}
            <ScrollToTopButton />

            {/* 🎨 테마 변경 버튼 */}
            <button
                onClick={() => setIsPanelOpen(true)}
                className="fixed bottom-6 right-6 w-24 h-24 bg-blue-200 text-blue-900 text-sm font-semibold rounded-full shadow-lg
                   flex items-center justify-center transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 hover:scale-105 z-50"
            >
                테마 변경
            </button>
        </div>
    );
}