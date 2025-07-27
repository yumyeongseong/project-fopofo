import { useNavigate } from "react-router-dom";
import MypageHeader from "../../components/MypageHeader";

export default function MypageIntroSection() {
    const navigate = useNavigate();

    const categories = [
        { label: "자기소개서 편집", path: "/mypage/intro" },
        { label: "포트폴리오 편집", path: "/mypage/portfolio" },
        { label: "나만의 챗봇 편집", path: "/mypage/chatbot" },
    ];
    {/* 상단 헤더 */ }

    {/* 중앙 제목 */ }

    return (
        <div className="min-h-screen bg-pink-100 flex flex-col">
            <MypageHeader />

            {/* 하단 메인 컨텐츠 박스 */}
            <div className="bg-gradient-to-b from-blue-100 to-blue-200 
  mx-auto w-[95%] max-w-6xl px-10 py-20 min-h-[600px]
  rounded-xl shadow-md flex flex-col items-center justify-center">
                {/* 카테고리 버튼 3개 */}
                <div className="flex gap-8 flex-wrap justify-center">
                    {categories.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => navigate(item.path)}
                            className="border border-gray-400 bg-white px-8 py-4 rounded-md 
                text-brown-700 font-serif text-lg relative group shadow-sm hover:shadow-md"
                        >
                            <span className="relative z-10">{item.label}</span>
                            <span className="absolute left-0 bottom-2 w-full h-0.5 bg-brown-400 
                scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}