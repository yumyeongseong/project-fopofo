export default function CategoryButtons({ activeSection, toggleSection }) {
    const categories = [
        { name: "intro", label: "자기소개서" },
        { name: "portfolio", label: "포트폴리오" },
        { name: "chatbot", label: "나만의 챗봇" },
    ];

    return (
        <div className="flex justify-between px-[12vw] mt-12">
            {categories.map((cat) => (
                <button
                    key={cat.name}
                    onClick={() => toggleSection(cat.name)}
                    className={`px-10 py-5 rounded-full text-lg font-bold tracking-wide transition-all duration-300 shadow-md
            ${activeSection === cat.name
                            ? "bg-gradient-to-b from-white to-blue-50 text-blue-700 border-2 border-blue-300 ring-2 ring-blue-100"
                            : "bg-gradient-to-b from-white to-blue-50 text-gray-800 border border-gray-200"
                        } hover:scale-[1.07] hover:ring-2 hover:ring-blue-100`}
                >
                    {cat.label}
                </button>
            ))}
        </div>
    );
}