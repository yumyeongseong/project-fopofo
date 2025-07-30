import { FileText, LayoutGrid, Bot } from "lucide-react";

export default function CategoryButtons({ activeSection, toggleSection }) {
  const categories = [
    { name: "intro", label: "자기소개서", icon: <FileText className="w-5 h-5 mr-2" /> },
    { name: "portfolio", label: "포트폴리오", icon: <LayoutGrid className="w-5 h-5 mr-2" /> },
    { name: "chatbot", label: "나만의 챗봇", icon: <Bot className="w-5 h-5 mr-2" /> },
  ];

  return (
    <div className="flex justify-center gap-4 sm:gap-8 md:gap-12 lg:gap-16 mt-12 px-4">
      {categories.map((cat) => {
        const isActive = activeSection === cat.name;

        return (
          <button
            key={cat.name}
            onClick={() => toggleSection(cat.name)}
            // ✅ [디자인] 활성화 시 핑크색 테마 적용
            className={`flex items-center justify-center px-6 sm:px-10 py-4 rounded-full text-base sm:text-lg font-medium tracking-wide backdrop-blur-md transition-all duration-300 ease-in-out shadow-md
              ${isActive
                ? "bg-white text-pink-500 ring-2 ring-pink-300 shadow-lg"
                : "bg-white/70 text-gray-800 hover:bg-white/90 hover:shadow-xl"
              } hover:scale-105 font-[SUIT]`}
          >
            {cat.icon}
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}