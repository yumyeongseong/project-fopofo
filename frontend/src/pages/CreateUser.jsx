import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { nodeApi } from "../services/api"; // ✅ api.js import

export default function CreateUser() {
    // ✅ name -> nickname 으로 변수명 변경 (백엔드와 통일)
    const [nickname, setNickname] = useState("");
    const navigate = useNavigate();

    // ✅ 닉네임 설정 API를 호출하는 로직으로 전체 수정
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nickname) return;

        try {
            // 백엔드의 닉네임 설정 API 호출
            await nodeApi.put('/users/set-nickname', { nickname });
            
            alert('닉네임이 설정되었습니다. 포트폴리오 업로드 페이지로 이동합니다.');
            navigate(`/upload`); // 성공 시 업로드 페이지로 이동

        } catch (error) {
            // 중복된 닉네임 등의 에러 메시지를 사용자에게 보여줌
            alert(error.response?.data?.message || '오류가 발생했습니다.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 mt-40">
            <input
                type="text"
                placeholder="사용할 닉네임을 입력하세요" // ✅ 문구 수정
                className="px-4 py-2 rounded shadow"
                value={nickname} // ✅ state와 연결
                onChange={(e) => setNickname(e.target.value)} // ✅ state와 연결
            />
            <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded">
                포트폴리오 생성하기
            </button>
        </form>
    );
}