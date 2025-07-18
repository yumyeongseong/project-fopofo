import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CategoryButtons from "./CategoryButtons";
import IntroSection from "./IntroSection";
import PortfolioSection from "./PortfolioSection";
import ChatbotSection from "./ChatbotSection";
import ScrollToTopButton from "./ScrollToTopButton";
import ThemePanel from "./ThemePanel";
import { Paintbrush } from "lucide-react";

export default function UserMainPage() {
    const { userName } = useParams();
    const [activeSection, setActiveSection] = useState(null);
    const [font, setFont] = useState("font-serif");
    const [background, setBackground] = useState("bg-gradient-to-b from-blue-100 to-blue-200");
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    const [showIntro, setShowIntro] = useState(false);
    const [showResume, setShowResume] = useState(false);

    const [introUrl, setIntroUrl] = useState("");
    const [resumeUrl, setResumeUrl] = useState("");

    const toggleSection = (sectionName) => {
        setActiveSection((prev) => (prev === sectionName ? null : sectionName));
    };

    useEffect(() => {
        if (activeSection === "intro") {
            setShowIntro(true);
            setTimeout(() => setShowResume(true), 300);

            fetch("/api/user/files") // 실제 API 경로로 수정 필요
                .then(res => res.json())
                .then(data => {
                    setIntroUrl(data.introUrl);
                    setResumeUrl(data.resumeUrl);
                })
                .catch(err => {
                    console.error("파일 URL 불러오기 실패:", err);
                });
        } else {
            setShowIntro(false);
            setShowResume(false);
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
                        for <span className="font-bold">{userName}</span>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 mt-10">
                    <div className={`transition-opacity duration-500 ${showIntro ? 'opacity-100' : 'opacity-0'}`}>
                        <IntroSection type="intro" fileUrl={introUrl} />
                    </div>
                    <div className={`transition-opacity duration-500 delay-300 ${showResume ? 'opacity-100' : 'opacity-0'}`}>
                        <IntroSection type="resume" fileUrl={resumeUrl} />
                    </div>
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
