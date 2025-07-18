import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateUser() {
    const [name, setName] = useState("");
    const [error, setError] = useState(false); // 👈 에러 상태 추가
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError(true); // 👈 에러 상태 true
            return;
        }
        setError(false); // 👈 에러 초기화
        navigate("/intro-upload"); // 👈 업로드 페이지로 이동
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 mt-40">
            <input
                type="text"
                placeholder="당신의 이름을 입력하세요"
                className="px-4 py-2 rounded shadow border"
                value={name}
                onChange={(e) => {
                    setName(e.target.value);
                    if (e.target.value.trim()) setError(false); // 👈 입력 시 에러 해제
                }}
            />
            {error && (
                <p className="text-red-500 text-sm mt-[-12px] mb-[-8px]">
                    이름을 입력해주세요.
                </p>
            )}
            <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
                포트폴리오 생성하기
            </button>
        </form>
    );
}