import React from "react";
import { X } from "lucide-react";

export default function ThemePanel({
  isOpen,
  onClose,
  setFont,
  background,
  setBackground,
  setBackgroundImage,
  currentFont,
  textColor,
  setTextColor,
}) {
  const fontOptions = ["font-serif", "font-sans", "font-mono"];
  const backgroundOptions = [
    "bg-white",
    "bg-gradient-to-b from-blue-100 to-blue-200",
    "bg-pink-100",
    "bg-gray-100",
  ];

  return (
    <div
      className={`fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 overflow-y-auto ${isOpen ? "translate-x-0" : "translate-x-full"
        }`}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h2 className="text-md font-semibold flex items-center gap-1">
          🎨 테마 설정
        </h2>
        <button onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      {/* 폰트 선택 */}
      <div className="p-4">
        <p className="text-sm font-medium mb-2 text-gray-700">폰트 선택</p>
        <div className="space-y-2 bg-blue-50 p-3 rounded-lg">
          {fontOptions.map((fontClass) => (
            <button
              key={fontClass}
              onClick={() => setFont(fontClass)}
              className={`block w-full py-2 rounded-md text-sm ${currentFont === fontClass
                ? "bg-blue-500 text-white font-bold"
                : "bg-white border text-gray-800 hover:bg-gray-100"
                }`}
            >
              {fontClass.split('-')[1]}
            </button>
          ))}
        </div>
      </div>

      {/* 배경 선택 */}
      <div className="p-4">
        <p className="text-sm font-medium mb-2 text-gray-700">배경 선택</p>
        <div className="space-y-2 bg-green-50 p-3 rounded-lg">
          {backgroundOptions.map((bgClass) => (
            <button
              key={bgClass}
              onClick={() => {
                setBackground(bgClass);
                setBackgroundImage(null); // 이미지 배경 초기화
              }}
              className={`block w-full py-2 rounded-md text-sm border transition text-black ${background === bgClass
                ? `ring-2 ring-offset-2 ring-green-400 bg-white font-semibold`
                : "bg-white hover:bg-gray-100"
                }`}
            >
              {bgClass.substring(0, 20)}
            </button>
          ))}
        </div>
      </div>

      {/* 텍스트 색상 선택 */}
      <div className="p-4">
        <p className="text-sm font-medium text-gray-700 mb-2">텍스트 색상</p>
        <input
          type="color"
          value={textColor}
          onChange={(e) => setTextColor(e.target.value)}
          className="w-full h-10 border rounded cursor-pointer"
        />
      </div>

      {/* 사용자 배경 이미지 */}
      <div className="p-4">
        <p className="text-sm font-medium text-gray-700 mb-2">배경 이미지</p>
        <label
          htmlFor="bg-upload"
          className="block w-full px-4 py-2 text-sm text-center text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm cursor-pointer hover:bg-gray-50 transition"
        >
          이미지 업로드
        </label>
        <input
          id="bg-upload"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                const imageUrl = `url('${reader.result}')`;
                setBackground(""); // Tailwind 클래스 제거
                setBackgroundImage(imageUrl);
              };
              reader.readAsDataURL(file);
            }
          }}
          className="hidden"
        />
      </div>
    </div>
  );
}