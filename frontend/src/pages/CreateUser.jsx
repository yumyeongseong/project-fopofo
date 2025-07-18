import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateUser() {
    const [name, setName] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name) return;
        navigate(`/user/${name}`);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 mt-40">
            <input
                type="text"
                placeholder="당신의 이름을 입력하세요"
                className="px-4 py-2 rounded shadow"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded">
                포트폴리오 생성하기
            </button>
        </form>
    );
}