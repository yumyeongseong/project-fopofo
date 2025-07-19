import { useState, useEffect } from "react";
// 👇 1. 필요한 모든 훅과 컴포넌트, api를 import 합니다.
import { useParams } from "react-router-dom";
import { nodeApi } from "../services/api";
import CategoryButtons from "./CategoryButtons";
import IntroSection from "./IntroSection";
import PortfolioSection from "./PortfolioSection";
import ChatbotSection from "./ChatbotSection";
import ScrollToTopButton from "./ScrollToTopButton";
import ThemePanel from "./ThemePanel";
import { Paintbrush } from "lucide-react";

// 👇 2. URL 파라미터를 받기 위해 props 대신 useParams를 사용하도록 구조를 변경합니다.
export default function UserMainPage() {
  const { userId } = useParams(); // URL의 /user/:userId 에서 userId 값을 가져옵니다.

  // --- 3. 상태(state) 선언: 두 버전의 상태를 모두 가져옵니다. ---
  const [activeSection, setActiveSection] = useState(null);
  const [font, setFont] = useState("font-serif");
  const [background, setBackground] = useState("bg-gradient-to-b from-blue-100 to-blue-200");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(false); // 팀원의 애니메이션용 상태
  const [showResume, setShowResume] = useState(false); // 팀원의 애니메이션용 상태

  // --- 4. 데이터 로딩 로직: 내 버전의 /users/me 호출 방식을 사용합니다. ---
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // 이 API가 introFileUrl, resumeFileUrl, portfolio 목록 등을 모두 반환해야 합니다.
        const response = await nodeApi.get('/users/me');
        setUserData(response.data.user);
      } catch (error) {
        console.error("사용자 정보 로딩 실패:", error.response?.data || error.message);
        alert("사용자 정보를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []); // 컴포넌트가 처음 로드될 때 한 번만 실행됩니다.

  // --- 5. UI 효과 로직: 팀원의 코드를 가져옵니다. ---
  useEffect(() => {
    if (activeSection === "intro") {
      setShowIntro(true);
      setTimeout(() => setShowResume(true), 300);
    } else {
      setShowIntro(false);
      setShowResume(false);
    }
  }, [activeSection]);

  const toggleSection = (sectionName) => {
    setActiveSection((prev) => (prev === sectionName ? null : sectionName));
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;
  }

  return (
    // --- 6. 렌더링(JSX): 팀원의 UI 구조를 기반으로 하고, 실제 데이터를 연결합니다. ---
    <div className={`min-h-screen pt-[96px] ${background} ${font} relative transition-all duration-300 overflow-x-hidden`}>
      <ThemePanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} setFont={setFont} setBackground={setBackground} />
      <div className="fixed top-6 left-0 right-0 z-40">
        <CategoryButtons activeSection={activeSection} toggleSection={toggleSection} />
      </div>

      {!activeSection && (
        <div className="flex flex-col items-center justify-center mt-40 animate-fade-in">
          <h1 className="text-3xl sm:text-5xl tracking-widest text-gray-800 text-center leading-snug">
            Portfolio web<br />
            {/* URL에서 가져온 userId를 표시합니다. */}
            for <span className="font-bold">{userId}</span>
          </h1>
        </div>
      )}

      {activeSection === "chatbot" && (
        <div className="flex items-center justify-center min-h-screen pt-24">
          <ChatbotSection />
        </div>
      )}

      {activeSection === "portfolio" && (
        <div className="mt-10 px-6">
          {/* PortfolioSection에 실제 데이터를 props로 전달합니다. */}
          <PortfolioSection portfolio={userData?.portfolio} />
        </div>
      )}

      {activeSection === "intro" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 mt-10">
          <div className={`transition-opacity duration-500 ${showIntro ? 'opacity-100' : 'opacity-0'}`}>
            {/* userData에서 자기소개서(intro) 파일 URL을 찾아 fileUrl로 전달합니다. */}
            <IntroSection type="intro" fileUrl={userData?.introFileUrl} />
          </div>
          <div className={`transition-opacity duration-500 delay-300 ${showResume ? 'opacity-100' : 'opacity-0'}`}>
            {/* userData에서 이력서(resume) 파일 URL을 찾아 fileUrl로 전달합니다. */}
            <IntroSection type="resume" fileUrl={userData?.resumeFileUrl} />
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