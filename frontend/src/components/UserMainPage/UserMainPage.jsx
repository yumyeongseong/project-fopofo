import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// ✅ [수정] 컴포넌트 import 경로를 './'에서 '../'로 변경
import CategoryButtons from '../CategoryButtons';
import IntroSection from '../IntroSection';
import PortfolioSection from '../PortfolioSection';
import ChatbotSection from '../ChatbotSection';
import ScrollToTopButton from '../ScrollToTopButton';
import ThemePanel from '../ThemePanel';
import { Paintbrush } from 'lucide-react';
// ✅ [수정] 상위 폴더로 이동하는 경로로 변경
import { nodeApi } from '../../services/api';

// 'UserMainPage.jsx' 파일은 원래의 공개 포트폴리오 페이지 코드를 기준으로 합니다.
export default function UserMainPage() {
  // URL에서 userId를 동적으로 가져옵니다. (예: /portfolio/user123)
  const { userId } = useParams();
  const [activeSection, setActiveSection] = useState(null);
  const [font, setFont] = useState("font-serif");
  const [background, setBackground] = useState("bg-gradient-to-b from-blue-100 to-blue-200");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      };
      try {
        setIsLoading(true);
        const response = await nodeApi.get(`/public/portfolio/${userId}`);
        setUserData(response.data);
      } catch (error) {
        console.error("포트폴리오 데이터를 불러오는 데 실패했습니다.", error);
        setUserData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const toggleSection = (sectionName) => {
    setActiveSection(prevSection => prevSection === sectionName ? null : sectionName);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;
  }

  if (!userData) {
    return <div className="min-h-screen flex items-center justify-center">포트폴리오 정보를 불러올 수 없습니다.</div>;
  }

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
            for <span className="font-bold">{userData.nickname || '...'}</span>
          </h1>
        </div>
      )}

      {activeSection === "intro" && (
        <div className="grid grid-cols-1 justify-items-center gap-6 px-6 mt-10">
          <div className="w-full max-w-2xl">
            <IntroSection type="intro" fileUrl={userData.introFileUrl} />
          </div>
        </div>
      )}

      {activeSection === "portfolio" && (
        <div className="mt-10">
          <PortfolioSection portfolioData={userData.portfolio} />
        </div>
      )}

      {activeSection === "chatbot" && (
        <div className="flex items-center justify-center min-h-screen pt-24">
          <ChatbotSection publicUserId={userId} />
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