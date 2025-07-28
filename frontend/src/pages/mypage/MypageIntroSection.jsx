import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";
import "./MypageIntroSection.css";

export default function MypageIntroSection() {
    const navigate = useNavigate();

    const categories = [
        { label: "자기소개서 편집", path: "/mypage/intro" },
        { label: "포트폴리오 편집", path: "/mypage/portfolio" },
        { label: "나만의 챗봇 편집", path: "/mypage/chatbot" },
    ];

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/"); // 시작페이지 이동
    };

    return (
        <div className="mypage-container">
            {/* 좌측 상단 로고 */}
            <img
                src="/Fopofo-Logo-v2.png"
                alt="FoPoFo Logo"
                className="mypage-logo"
                onClick={() => navigate("/")}
            />

            {/* 우측 상단 버튼 */}
            <div className="mypage-buttons">
                <button className="outline-btn" onClick={handleLogout}>
                    logout
                </button>
                <button className="outline-btn" onClick={() => navigate("/home")}>
                    home
                </button>
            </div>

            {/* 본문 */}
            <div className="mypage-intro-container">
                <h1 className="mypage-title">My Page</h1>
                <div className="mypage-category-grid">
                    {categories.map((item, index) => (
                        <button
                            key={index}
                            className="mypage-category-btn"
                            onClick={() => navigate(item.path)}
                        >
                            <Pencil size={16} className="category-icon" />
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
