import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { nodeApi } from '../services/api';
import CategoryButtons from "../components/CategoryButtons";
import IntroSection from "../components/IntroSection";
import PortfolioSection from "../components/PortfolioSection";
import ChatbotSection from "../components/ChatbotSection";
import ScrollToTopButton from "../components/ScrollToTopButton";
import ThemePanel from "../components/ThemePanel";
import { Paintbrush } from "lucide-react";

export default function PublicPortfolioPage() {
  const { userId } = useParams();

  const [activeSection, setActiveSection] = useState('intro');
  const [portfolioData, setPortfolioData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [font, setFont] = useState("font-serif");
  const [background, setBackground] = useState("bg-gradient-to-b from-blue-100 to-blue-200");
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const toggleSection = (sectionName) => {
    setActiveSection((prevSection) => (prevSection === sectionName ? null : sectionName));
  };

  useEffect(() => {
    if (!userId) return;

    const fetchPublicPortfolio = async () => {
      setIsLoading(true);
      try {
        const response = await nodeApi.get(`/public/portfolio/${userId}`);
        setPortfolioData(response.data.data);
      } catch (err) {
        console.error("공개 포트폴리오 조회 실패:", err);
        setError("포트폴리오를 불러올 수 없습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPublicPortfolio();
  }, [userId]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">포트폴리오를 불러오는 중입니다...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center">{error}</div>;
  if (!portfolioData) return <div className="min-h-screen flex items-center justify-center">포트폴리오 데이터가 없습니다.</div>;

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
            {portfolioData.user?.nickname || userId}님의 <br /> 포트폴리오입니다.
          </h1>
        </div>
      )}

      {activeSection === "chatbot" && (
        <div className="flex items-center justify-center min-h-screen pt-24">
          {/* ✅ 챗봇에게 이 페이지의 주인 ID를 명확히 알려줍니다. */}
          <ChatbotSection publicUserId={userId} />
        </div>
      )}

      {activeSection === "portfolio" && (
        <div className="mt-10">
          <PortfolioSection portfolioItems={portfolioData} isReadOnly={true} />
        </div>
      )}

      {activeSection === "intro" && (
        <div className="grid grid-cols-1 justify-items-center gap-6 px-6 mt-10">
          <div className="w-full max-w-2xl">
            {/* ✅ 백엔드에서 resume 데이터가 단일 객체로 오도록 수정했으므로, [0] 인덱싱을 제거합니다. */}
            <IntroSection type="intro" fileUrl={portfolioData.resume?.presignedUrl} />
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