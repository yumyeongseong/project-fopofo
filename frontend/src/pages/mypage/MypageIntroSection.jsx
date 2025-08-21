import { useNavigate } from "react-router-dom";
import './MypageIntroSection.css'; // ✅ 새로운 디자인의 CSS 파일을 사용합니다.
import { useAuth } from "../../contexts/AuthContext";
import { FileText, Clapperboard, Bot } from 'lucide-react';

export default function MypageIntroSection() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const categories = [
        { label: "자기소개서 편집", path: "/mypage/intro", icon: <FileText className="category-icon" /> },
        { label: "포트폴리오 편집", path: "/mypage/portfolio", icon: <Clapperboard className="category-icon" /> },
        { label: "나만의 챗봇 편집", path: "/mypage/chatbot", icon: <Bot className="category-icon" /> },
    ];

    const handleLogout = () => {
        logout();
        navigate('/mainpage');
    };

    return (
        <div className="mypage-container">
            <img 
                src="/Fopofo-Logo-v2.png" 
                alt="logo" 
                className="mypage-logo"
                onClick={() => navigate('/mainpage')}
            />
            <div className="mypage-buttons">
                <button className="outline-btn" onClick={handleLogout}>logout</button>
                <button className="outline-btn" onClick={() => navigate('/home')}>home</button>
            </div>
            
            <div className="mypage-intro-container">
                <h1 className="mypage-title">My Page</h1>
                <div className="mypage-category-grid">
                    {categories.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => navigate(item.path)}
                            className="mypage-category-btn"
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}