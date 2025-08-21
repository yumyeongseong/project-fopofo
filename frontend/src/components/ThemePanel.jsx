import React from "react";
import { X } from "lucide-react";

export default function ThemePanel({
    isOpen, onClose, setFont, background, setBackground,
    setBackgroundImage, currentFont, textColor, setTextColor,
}) {
    const fontOptions = ["font-serif", "font-sans", "font-mono"];
    const backgroundOptions = ["bg-white", "bg-gradient-to-b from-blue-100 to-blue-200", "bg-pink-100", "bg-gray-100"];

    return (
        <div className={`theme-panel ${isOpen ? "open" : ""}`}>
            <div className="theme-panel-header">
                <h2 className="theme-panel-title">🎨 테마 설정</h2>
                <button onClick={onClose}><X size={18} /></button>
            </div>
            <div className="theme-panel-section">
                <p className="theme-panel-subtitle">폰트 선택</p>
                <div className="theme-options-box font-box">
                    {fontOptions.map((fontClass) => (
                        <button key={fontClass} onClick={() => setFont(fontClass)}
                            className={`theme-option-button ${currentFont === fontClass ? "selected" : ""}`}>
                            {fontClass.replace('font-', '')}
                        </button>
                    ))}
                </div>
            </div>
            <div className="theme-panel-section">
                <p className="theme-panel-subtitle">배경 선택</p>
                <div className="theme-options-box bg-box">
                    {backgroundOptions.map((bgClass) => {
                        const isSelected = background === bgClass;
                        return (
                            <button key={bgClass} onClick={() => { setBackground(bgClass); setBackgroundImage(null); }}
                                className={`theme-option-button ${isSelected ? "selected" : ""}`}>
                                {bgClass.split(' ')[0].replace('bg-', '')}
                            </button>
                        );
                    })}
                </div>
            </div>
            <div className="theme-panel-section">
                <p className="theme-panel-subtitle">텍스트 색상 선택</p>
                <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="color-picker" />
            </div>
            <div className="theme-panel-section">
                <p className="theme-panel-subtitle">사용자 배경 이미지</p>
                <label htmlFor="bg-upload" className="upload-label-button">이미지 업로드</label>
                <input id="bg-upload" type="file" accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                            if (file.name.toLowerCase().endsWith(".heic")) {
                                alert("HEIC 형식은 지원하지 않아요❌ JPG나 PNG로 변환해서 업로드해주세요");
                                return;
                            }
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                setBackground("");
                                setBackgroundImage(`url('${reader.result}')`);
                            };
                            reader.readAsDataURL(file);
                        }
                    }}
                    className="hidden-file-input"
                />
            </div>
        </div>
    );
}