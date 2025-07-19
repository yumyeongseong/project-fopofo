import { UserCircle, FolderKanban, Bot } from "lucide-react"; // 아이콘 가져오기

export default function CategoryButtons({ activeSection, toggleSection }) {
    const categories = [
        { name: "intro", label: "자기소개서", icon: <UserCircle className="w-6 h-6" /> },
        { name: "portfolio", label: "포트폴리오", icon: <FolderKanban className="w-6 h-6" /> },
        { name: "chatbot", label: "나만의 챗봇", icon: <Bot className="w-6 h-6" /> },
    ];

    return (
        <div className="flex justify-center gap-64 px-4 md:px-[10vw] mt-12">
            {categories.map((cat) => (
                <button
                    key={cat.name}
                    onClick={() => toggleSection(cat.name)}
                    className={`px-6 py-4 rounded-2xl text-sm sm:text-base font-medium tracking-wide backdrop-blur-md transition-all duration-300 ease-in-out shadow-md
                    ${activeSection === cat.name
                            ? "bg-white text-blue-600 ring-2 ring-blue-300 shadow-lg"
                            : "bg-white/70 text-gray-800 hover:bg-white/90 hover:shadow-xl"
                        } hover:scale-105 font-[SUIT]`}
                >
                    <div className="flex flex-col items-center justify-center gap-1">
                        {cat.icon}
                        <span>{cat.label}</span>
                    </div>
                </button>
            ))}
        </div>
    );
}