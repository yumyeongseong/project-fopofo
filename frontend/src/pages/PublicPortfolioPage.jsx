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

  const [portfolioData, setPortfolioData] = useState(null);
  const [introUrl, setIntroUrl] = useState(null);
  const [ownerNickname, setOwnerNickname] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(null);
  const [font, setFont] = useState("font-serif");
  const [background, setBackground] = useState("bg-gradient-to-b from-blue-100 to-blue-200");
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const toggleSection = (sectionName) => {
    setActiveSection(prev => (prev === sectionName ? null : sectionName));
  };

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchPublicData = async () => {
      setIsLoading(true);
      try {
        const [portfolioRes, introRes] = await Promise.all([
          nodeApi.get(`/public/portfolio/${userId}`),
          nodeApi.get(`/public/intro/${userId}`)
        ]);

        setPortfolioData(portfolioRes.data.data);
        setOwnerNickname(portfolioRes.data.userNickname);
        setIntroUrl(introRes.data.data?.presignedUrl || null);
        setError(null);
      } catch (err) {
        console.error("공개 포트폴리오 데이터 로딩 실패:", err);
        setError("데이터를 불러올 수 없습니다. URL을 다시 확인해주세요.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublicData();
  }, [userId]);


  if (isLoading) return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
  if (error) return <div className="flex justify-center items-center h-screen">{error}</div>;

  return (
    <div className={`min-h-screen pt-[96px] ${background} ${font} relative transition-all duration-300 overflow-x-hidden`}>
      <ThemePanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} setFont={setFont} setBackground={setBackground} />

      {/* ✅ 1. 헤더 안의 h1 제목 태그를 삭제하여 상단 제목을 제거합니다. */}
      <header className="flex justify-center items-center px-6 py-4 absolute top-0 left-0 right-0">
      </header>

      {/* ✅ 2. top-16을 top-12로 변경하여 버튼을 더 위로 올립니다. (이 숫자를 더 작게 조절하셔도 됩니다) */}
      <div className="fixed top-1 left-0 right-0 z-40">
        <CategoryButtons activeSection={activeSection} toggleSection={toggleSection} />
      </div>

      {!activeSection && (
        <div className="flex flex-col items-center justify-center mt-40 animate-fade-in">
          <h1 className="text-3xl sm:text-5xl tracking-widest text-gray-800 text-center leading-snug">
            {ownerNickname}'s<br /> Portfolio
          </h1>
        </div>
      )}
      
      {activeSection === "chatbot" && (
        <div className="flex items-center justify-center min-h-screen pt-24">
          <ChatbotSection publicUserId={userId} ownerName={ownerNickname} />
        </div>
      )}

      {activeSection === "portfolio" && (
        <div className="mt-10 px-6">
          <PortfolioSection publicPortfolioData={portfolioData} />
        </div>
      )}

      {activeSection === "intro" && (
        <div className="grid grid-cols-1 justify-items-center gap-6 px-6 mt-10">
          <div className="w-full max-w-2xl">
            <IntroSection type="intro" fileUrl={introUrl} />
          </div>
        </div>
      )}

      <ScrollToTopButton />

      <button
        onClick={() => setIsPanelOpen(true)}
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