import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { nodeApi } from "../services/api";
import { useAuth } from '../contexts/AuthContext';

export default function CreateUser() {
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState(false); // 지현 에러 표시 유지
  const navigate = useNavigate();
  const { updateUserNickname } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nickname.trim()) {
      setError(true);
      return;
    }

    try {
      await nodeApi.put('/users/set-nickname', { nickname });
      updateUserNickname(nickname); // 팀장 context 연동

      alert('닉네임이 설정되었습니다. 포트폴리오 업로드 페이지로 이동합니다.');
      navigate(`/intro-upload`);
    } catch (error) {
      alert(error.response?.data?.message || '닉네임 설정 중 오류가 발생했습니다.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 mt-40">
      <input
        type="text"
        placeholder="사용할 닉네임을 입력하세요"
        className="px-4 py-2 rounded shadow border"
        value={nickname}
        onChange={(e) => {
          setNickname(e.target.value);
          if (e.target.value.trim()) setError(false);
        }}
      />
      {error && (
        <p className="text-red-500 text-sm mt-[-12px] mb-[-8px]">
          닉네임을 입력해주세요.
        </p>
      )}
      <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
        포트폴리오 생성하기
      </button>
    </form>
  );
}
