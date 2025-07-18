// 👇 1. useEffect와 함께 nodeApi를 import 합니다.
import { useState, useEffect } from "react";
import { nodeApi } from "../services/api"; // 경로 확인 필요

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

  // 👇 2. 사용자 데이터를 저장할 새로운 state를 추가합니다.
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

  // 👇 3. 페이지가 로드될 때 사용자 데이터를 가져오는 useEffect를 추가합니다.
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Node.js 서버의 /users/me 엔드포인트를 호출합니다.
        // api.js의 인터셉터가 토큰을 자동으로 헤더에 추가해줍니다.
        const response = await nodeApi.get('/users/me');
        setUserData(response.data.user); // 응답 데이터를 state에 저장
      } catch (error) {
        console.error("사용자 정보 로딩 실패:", error.response?.data || error.message);
        alert("사용자 정보를 불러오는데 실패했습니다.");
        // navigate('/login'); // 필요시 로그인 페이지로 이동
      } finally {
        setIsLoading(false); // 로딩 상태 종료
      }
    };

    fetchUserData();
  }, []); // 빈 배열을 전달하여 컴포넌트가 처음 마운트될 때 한 번만 실행되도록 합니다.

  const toggleSection = (sectionName) => {
    setActiveSection((prev) => (prev === sectionName ? null : sectionName));
  };

  // 👇 4. 로딩 중일 때 보여줄 화면을 추가합니다.
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;
  }

  // --- 이 아래의 JSX 반환 부분도 수정이 필요합니다. ---
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
        {/* 👇 5. 각 섹션에 불러온 사용자 데이터를 props로 전달합니다. */}
        {activeSection === "intro" && <IntroSection intro={userData?.intro} />}
        {activeSection === "portfolio" && <PortfolioSection portfolio={userData?.portfolio} />}
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