import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { nodeApi } from "../../services/api";
import CategoryButtons from "../CategoryButtons";
import IntroSection from "../IntroSection";
import PortfolioSection from "../PortfolioSection";
import ChatbotSection from "../ChatbotSection";
import ScrollToTopButton from "../ScrollToTopButton";
import ThemePanel from "../ThemePanel";
import { Paintbrush } from "lucide-react";
import "./UserMainPage.css";

export default function UserMainPage() {
  const { userId } = useParams();

  const [activeSection, setActiveSection] = useState(null);
  const [font, setFont] = useState("font-serif");
  const [background, setBackground] = useState("bg-white");
  const [textColor, setTextColor] = useState("#000000");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [backgroundImage, setBackgroundImage] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      setIsLoading(true);
      try {
        const response = await nodeApi.get(`/public/portfolio/${userId}`);
        setUserData(response.data);
      } catch (error) {
        console.error("사용자 정보 로딩 실패:", error);
        setUserData({
          nickname: userId,
          uploads: [
            {
              fileType: "intro",
              filePath: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
            },
            {
              fileType: "resume",
              filePath: "https://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf",
            },
          ],
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const toggleSection = (sectionName) => {
    setActiveSection((prev) => (prev === sectionName ? null : sectionName));
  };

  if (isLoading || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        포트폴리오를 불러오는 중입니다...
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen pt-[96px] ${background} ${font} transition-all duration-300 overflow-x-hidden`}
      style={
        backgroundImage
          ? {
            backgroundImage: backgroundImage,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }
          : {}
      }
    >
      <ThemePanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        setFont={setFont}
        font={font}
        background={background}
        setBackground={setBackground}
        setBackgroundImage={setBackgroundImage}
        currentFont={font}
        textColor={textColor}
        setTextColor={setTextColor}
      />

      <div className={`fixed left-0 right-0 z-40 flex justify-center gap-8 transition-all duration-300 ${activeSection ? "scale-90 top-0" : "scale-100 top-6"}`}>
        <CategoryButtons activeSection={activeSection} toggleSection={toggleSection} />
      </div>

      {!activeSection && (
        <div className="flex flex-col items-center justify-center mt-60">
          <h1
            className={`text-[40px] sm:text-[60px] leading-tight text-center tracking-wide fade-float ${font}`}
            style={{ color: textColor }}
          >
            Portfolio web
          </h1>
          <h2 className="mt-6 text-center fade-float">
            <span
              className={`block text-[32px] sm:text-[44px] font-semibold ${font}`}
              style={{ color: textColor }}
            >
              For
            </span>
            <span
              className={`block text-[40px] sm:text-[54px] font-bold ${font} float-slow`}
              style={{ color: textColor }}
            >
              {userData?.nickname || userId}
            </span>
          </h2>
        </div>
      )}

      {activeSection === "chatbot" && <ChatbotSection />}

      {activeSection === "portfolio" && (
        <PortfolioSection
          portfolio={userData?.uploads?.filter(
            (f) => f.fileType !== "resume" && f.fileType !== "intro"
          )}
        />
      )}

      {activeSection === "intro" && (
        <div className="flex flex-col gap-10 px-6 mt-10 max-h-[80vh] overflow-y-auto items-center">
          {userData?.uploads?.map((file, index) => (
            <IntroSection key={index} fileUrl={file.filePath} />
          ))}
        </div>
      )}

      <ScrollToTopButton />

      <button
        onClick={() => setIsPanelOpen((prev) => !prev)}
        className={`fixed bottom-6 right-6 w-20 h-20 bg-white text-gray-700 text-xs font-medium rounded-full flex flex-col items-center justify-center transition duration-300 z-50 hover:shadow-lg hover:ring-2 hover:ring-blue-200 ${isPanelOpen ? "ring-2 ring-blue-400 shadow-inner" : "shadow-md"
          }`}
      >
        <Paintbrush className="w-5 h-5 mb-1" />
        테마 변경
      </button>
    </div>
  );
}
