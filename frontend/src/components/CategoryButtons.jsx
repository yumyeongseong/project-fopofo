import { FileText, LayoutGrid, Bot } from "lucide-react";

export default function CategoryButtons({ activeSection, toggleSection, textColor }) {
  const categories = [
    { name: "intro", label: "자기소개서", icon: <FileText className="w-4 h-4 mr-2" /> },
    { name: "portfolio", label: "포트폴리오", icon: <LayoutGrid className="w-4 h-4 mr-2" /> },
    { name: "chatbot", label: "나만의 챗봇", icon: <Bot className="w-4 h-4 mr-2" /> },
  ];

  return (
    <div className="flex justify-center items-center gap-4 sm:gap-6 backdrop-blur-md bg-white/70 px-4 py-3 rounded-full shadow-md">
      {categories.map((cat) => {
        const isActive = activeSection === cat.name;
        return (
          <button
            key={cat.name}
            onClick={() => toggleSection(cat.name)}
            className={`flex items-center justify-center px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-medium transition-all duration-200 ease-in-out border
              ${isActive
                ? "bg-pink-100 text-pink-600 border-pink-300"
                : "bg-transparent border-transparent hover:bg-white/50"
              }`}
            style={{ color: isActive ? '' : textColor }}
          >
            {cat.icon}
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}