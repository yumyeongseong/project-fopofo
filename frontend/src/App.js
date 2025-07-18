import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 메인/인증
import StartPage from "./pages/StartPage/StartPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import SignupPage from "./pages/SignupPage/SignupPage";
import HomePage from "./pages/HomePage/HomePage";
import CreateUser from "./pages/CreateUser";


// 마이페이지
import MypageIntroSection from "./pages/mypage/MypageIntroSection";
import IntroEditPage from "./pages/mypage/IntroEditPage";
import PortfolioEditPage from "./pages/mypage/PortfolioEditPage";
import ChatbotEditPage from "./pages/mypage/ChatbotEditPage";

// 포트폴리오
import PortfolioCreatedPage from "./pages/PortfolioCreatedPage/PortfolioCreatedPage";
import PortfolioUploadPage from "./pages/PortfolioUploadPage/PortfolioUploadPage";

//사용자용웹
import UserMainPage from "./components/UserMainPage";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* 시작/로그인/회원가입 */}
        <Route path="/" element={<StartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* 홈 */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/create-user" element={<CreateUser />} />

        {/* 마이페이지 */}
        <Route path="/mypage" element={<MypageIntroSection />} />
        <Route path="/mypage/intro" element={<IntroEditPage />} />
        <Route path="/mypage/portfolio" element={<PortfolioEditPage />} />
        <Route path="/mypage/chatbot" element={<ChatbotEditPage />} />

        {/* 포트폴리오 관련 */}
        <Route path="/create" element={<PortfolioCreatedPage />} />
        <Route path="/portfolio/upload" element={<PortfolioUploadPage />} />


        {/* 사용자용웹 */}
        <Route path="/user/:userName" element={<UserMainPage />} />

      </Routes>
    </Router>
  );
}
