import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ useNavigate 추가
import CategoryButtons from "./CategoryButtons";
import IntroSection from "./IntroSection";
import PortfolioSection from "./PortfolioSection";
import ChatbotSection from "./ChatbotSection";
import ScrollToTopButton from "./ScrollToTopButton";
import ThemePanel from "./ThemePanel";
import { Paintbrush } from "lucide-react";
import { nodeApi } from '../services/api'; // ✅ api.js import

export default function UserMainPage({ userName }) {
    const navigate = useNavigate(); // ✅ navigate 함수 추가
    const [activeSection, setActiveSection] = useState(null);
    const [font, setFont] = useState("font-serif");
    const [background, setBackground] = useState("bg-gradient-to-b from-blue-100 to-blue-200");
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    const toggleSection = (sectionName) => {
        // 현재 활성화된 섹션과 같은 버튼을 누르면 닫고(null),
        // 다른 버튼을 누르면 그 섹션을 엽니다.
        setActiveSection((prevSection) => (prevSection === sectionName ? null : sectionName));
    };

    // ✅ --- 이 아랫부분의 로직을 백엔드 연동을 위해 수정합니다. ---
    const [showIntro, setShowIntro] = useState(false);
    const [showResume, setShowResume] = useState(false);
    
    // ✅ 자기소개서, 이력서 파일 URL을 저장할 상태
    const [introUrl, setIntroUrl] = useState(null);
    const [resumeUrl, setResumeUrl] = useState(null);

    // ✅ 'intro' 섹션이 활성화될 때 실행되는 로직
    useEffect(() => {
        if (activeSection === "intro") {
            setShowIntro(true);
            setTimeout(() => setShowResume(true), 300);

            // ✅ 백엔드에서 이력서(resume) 파일 URL을 가져오는 함수 호출
            const fetchResume = async () => {
                try {
                    // nodeApi가 자동으로 토큰을 포함하여 요청을 보냅니다.
                    const response = await nodeApi.get('/user-upload/resume');
                    
                    // 응답 데이터에서 presignedUrl을 꺼내 상태에 저장합니다.
                    if (response.data && response.data.data.presignedUrl) {
                        setResumeUrl(response.data.data.presignedUrl);
                    }
                } catch (err) {
                    // 404 에러는 파일이 없는 경우이므로 정상 처리합니다.
                    if (err.response?.status === 404) {
                        console.log("업로드된 이력서가 없습니다.");
                    } else {
                        console.error("이력서 URL 불러오기 실패:", err);
                    }
                    setResumeUrl(null); // 파일이 없거나 에러 시 null로 설정
                }
            };

            // ✅ 자기소개서(intro) 파일 URL을 가져오는 로직 (API가 준비되면 추가)
            // 현재는 이력서(resume)와 동일한 URL을 임시로 사용합니다.
            // 실제 자기소개서 API가 있다면 아래 로직을 수정해야 합니다.
            fetchResume(); // 자기소개서용 fetch 함수도 동일하게 호출
            setIntroUrl(resumeUrl); // 임시로 resumeUrl을 introUrl에도 설정

        } else {
            setShowIntro(false);
            setShowResume(false);
        }
    }, [activeSection, resumeUrl]); // ✅ resumeUrl이 변경될 때도 useEffect를 다시 실행

    // ✅ --- 로직 수정 끝 ---

    // 👇 이 아래의 JSX 부분은 기존 코드와 100% 동일합니다. UI 구조 변경 없음.
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