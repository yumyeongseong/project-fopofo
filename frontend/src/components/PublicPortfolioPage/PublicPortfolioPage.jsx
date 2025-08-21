import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// ✅ publicApi를 사용합니다.
import { publicApi } from "../../services/api";
import CategoryButtons from "../../components/CategoryButtons";
import IntroSection from "../../components/IntroSection";
import PortfolioSection from "../../components/PortfolioSection";
import ChatbotSection from "../../components/ChatbotSection";
import ScrollToTopButton from "../../components/ScrollToTopButton";
import ThemePanel from "../../components/ThemePanel";
import { Paintbrush } from "lucide-react";
import "./PublicPortfolioPage.css";

export default function PublicPortfolioPage() {
    const { userId } = useParams();
    const [portfolioData, setPortfolioData] = useState(null);
    const [introUrl, setIntroUrl] = useState(null); // ✅ 자기소개서 URL을 위한 별도 state
    const [ownerNickname, setOwnerNickname] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [activeSection, setActiveSection] = useState(null);
    const [font, setFont] = useState("font-serif");
    const [background, setBackground] = useState("bg-white");
    const [textColor, setTextColor] = useState("#000000");
    const [backgroundImage, setBackgroundImage] = useState(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    useEffect(() => {
        const fetchPublicData = async () => {
            if (!userId) return;
            setIsLoading(true);
            try {
                // ✅ --- 여기가 핵심 수정 부분입니다 --- ✅
                // 1. 두 개의 API를 동시에 호출합니다.
                const [portfolioRes, introRes] = await Promise.all([
                    publicApi.get(`/api/public/portfolio/${userId}`),
                    publicApi.get(`/api/public/intro/${userId}`) // 자기소개서 전용 API 호출
                ]);

                setPortfolioData(portfolioRes.data.data);
                setIntroUrl(introRes.data.data?.presignedUrl || null); // 자기소개서 URL 저장
                setOwnerNickname(portfolioRes.data.userNickname || userId);

            } catch (error) {
                console.error("공개 포트폴리오 데이터 로딩 실패:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPublicData();
    }, [userId]);

    const toggleSection = (sectionName) => {
        setActiveSection((prev) => (prev === sectionName ? null : sectionName));
    };

    // ✅ getIntroUrl 함수는 이제 필요 없습니다.

    if (isLoading) {
        return <div className="loading-container">포트폴리오를 불러오는 중입니다...</div>;
    }

    return (
        <div
            className={`public-page-wrapper ${background} ${font}`}
            style={backgroundImage ? { backgroundImage, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" } : {}}
        >
            <ThemePanel
                isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)}
                setFont={setFont} background={background} setBackground={setBackground}
                setBackgroundImage={setBackgroundImage} currentFont={font}
                textColor={textColor} setTextColor={setTextColor}
            />
            <div className="category-buttons-container">
                <CategoryButtons activeSection={activeSection} toggleSection={toggleSection} textColor={textColor} />
            </div>

            <main className="main-content">
                {!activeSection && (
                    <div className="main-title-container">
                        <h1 className="main-title-large" style={{ color: textColor }}>
                            Portfolio web
                        </h1>
                        <h2 className="main-subtitle-wrapper">
                            <span className="main-subtitle-for" style={{ color: textColor }}>For</span>
                            <span className="main-subtitle-name" style={{ color: textColor }}>{ownerNickname}</span>
                        </h2>
                    </div>
                )}

                {activeSection === "chatbot" && <ChatbotSection publicUserId={userId} ownerName={ownerNickname} />}
                {activeSection === "portfolio" && <PortfolioSection publicPortfolioData={portfolioData} />}
                
                {activeSection === "intro" && (
                    // ✅ 2. introUrl state를 직접 IntroSection에 전달합니다.
                    <div className="w-full max-w-3xl mt-16 flex justify-center">
                        <IntroSection fileUrl={introUrl} />
                    </div>
                )}
            </main>
            
            <ScrollToTopButton />
            <button onClick={() => setIsPanelOpen(true)} className="theme-button">
                <Paintbrush className="theme-icon" />
                테마 변경
            </button>
        </div>
    );
}