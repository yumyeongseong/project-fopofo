import React from "react";

export default function ThemePanel({ isOpen, onClose, setFont, setBackground }) {
    const fonts = ["font-serif", "font-sans", "font-mono"];
    const backgrounds = [
        "bg-gradient-to-b from-blue-100 to-blue-200",
        "bg-pink-100",
        "bg-gray-100"
    ];

    return (
        <div
            className={`fixed top-0 right-0 h-full w-64 bg-white shadow-2xl transform transition-transform duration-300 z-50 ${isOpen ? "translate-x-0" : "translate-x-full"
                }`}
        >
            <div className="p-6">
                <h2 className="text-xl font-bold mb-6">🎨 테마 설정</h2>

                <div className="mb-6">
                    <p className="font-semibold mb-2 text-gray-700">폰트 선택</p>
                    {fonts.map((f) => (
                        <button
                            key={f}
                            className="block w-full text-left px-4 py-2 mb-2 bg-blue-100 rounded-lg shadow hover:bg-blue-200 transition"
                            onClick={() => setFont(f)}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <div>
                    <p className="font-semibold mb-2 text-gray-700">배경 선택</p>
                    {backgrounds.map((bg, index) => (
                        <button
                            key={index}
                            className="block w-full text-left px-4 py-2 mb-2 bg-green-100 rounded-lg shadow hover:bg-green-200 transition"
                            onClick={() => setBackground(bg)}
                        >
                            {bg}
                        </button>
                    ))}
                </div>

                <button
                    onClick={onClose}
                    className="mt-8 w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                >
                    닫기
                </button>
            </div>
        </div>
    );
}