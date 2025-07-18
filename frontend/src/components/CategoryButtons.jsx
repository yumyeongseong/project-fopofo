import { FileText, LayoutGrid, Bot } from "lucide-react";

export default function CategoryButtons({ activeSection, toggleSection }) {
    const categories = [
        { name: "intro", label: "자기소개서", icon: <FileText className="w-5 h-5 mr-2" /> },
        { name: "portfolio", label: "포트폴리오", icon: <LayoutGrid className="w-5 h-5 mr-2" /> },
        { name: "chatbot", label: "나만의 챗봇", icon: <Bot className="w-5 h-5 mr-2" /> },
    ];

    return (
        <div className="flex justify-center gap-64 px-4 md:px-[10vw] mt-12">
            {categories.map((cat) => (
                <button
                    key={cat.name}
                    onClick={() => toggleSection(cat.name)}
                    className={`flex items-center justify-center px-10 py-4 rounded-full text-base sm:text-lg font-medium tracking-wide backdrop-blur-md transition-all duration-300 ease-in-out shadow-md
          ${activeSection === cat.name
                            ? "bg-white text-blue-600 ring-2 ring-blue-300 shadow-lg"
                            : "bg-white/70 text-gray-800 hover:bg-white/90 hover:shadow-xl"
                        } hover:scale-105 font-[SUIT]`}
                >
                    {cat.icon}
                    {cat.label}
                </button>
            ))}
        </div>
    );
}