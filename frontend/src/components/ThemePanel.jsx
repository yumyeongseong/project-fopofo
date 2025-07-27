import React, { useState } from "react";
import { Paintbrush } from "lucide-react";

export default function ThemePanel({ isOpen, onClose, setFont, setBackground }) {
    const fonts = ["font-serif", "font-sans", "font-mono"];
    const backgrounds = [
        "bg-gradient-to-b from-blue-100 to-blue-200",
        "bg-pink-100",
        "bg-gray-100"
    ];

    const [selectedFont, setSelectedFont] = useState(fonts[0]);
    const [selectedBg, setSelectedBg] = useState(backgrounds[0]);

    return (
        <div
            className={`fixed top-0 right-0 h-full w-72 bg-white transform transition-transform duration-300 z-50 
      ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        >
            <div className="p-6 h-full bg-gray-50 shadow-xl space-y-8 rounded-l-xl">

                {/* 헤더 */}
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <span className="p-1.5 bg-gray-100 rounded-md">
                            <Paintbrush className="w-5 h-5 text-blue-500" />
                        </span>
                        <span>테마 설정</span>
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-2xl text-gray-400 hover:text-black"
                    >
                        ×
                    </button>
                </div>

                {/* 📌 폰트 선택 영역 */}
                <div className="bg-blue-50 rounded-xl p-4 shadow-sm space-y-3">
                    <p className="font-semibold text-gray-700">폰트 선택</p>
                    <div className="space-y-2">
                        {fonts.map((f) => (
                            <button
                                key={f}
                                onClick={() => {
                                    setSelectedFont(f);
                                    setFont(f);
                                }}
                                className={`w-full text-center text-sm px-4 py-2 rounded-xl border shadow-sm transition
                ${selectedFont === f
                                        ? "bg-blue-500 text-white font-semibold"
                                        : "bg-white text-gray-800 hover:bg-blue-100"}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 📌 배경 선택 영역 */}
                <div className="bg-green-50 rounded-xl p-4 shadow-sm space-y-3">
                    <p className="font-semibold text-gray-700">배경 선택</p>
                    <div className="space-y-2">
                        {backgrounds.map((bg, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setSelectedBg(bg);
                                    setBackground(bg);
                                }}
                                className={`w-full flex items-center justify-between px-4 py-2 rounded-xl border shadow-sm text-sm transition
                ${selectedBg === bg
                                        ? "bg-green-500 text-white font-semibold"
                                        : "bg-white text-gray-800 hover:bg-green-100"}`}
                            >
                                <span>{bg}</span>
                                <div
                                    className={`w-5 h-5 rounded-full border border-gray-300 ${bg.includes("pink") ? "bg-pink-200"
                                        : bg.includes("gray") ? "bg-gray-200"
                                            : bg.includes("blue") ? "bg-blue-200"
                                                : "bg-white"
                                        }`}
                                />
                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}