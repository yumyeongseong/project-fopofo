import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { nodeApi } from "../services/api";

export default function CreateUser() {
  // 👇 [병합] 백엔드와 일치하는 'nickname'과 에러 처리를 위한 'error' 상태를 사용합니다.
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 👇 [병합] 팀원의 유효성 검사 로직을 추가합니다.
    if (!nickname.trim()) {
      setError(true);
      return;
    }

    try {
      // ✅ [연동] Node.js 서버의 닉네임 설정 API를 호출합니다.
      await nodeApi.put('/users/set-nickname', { nickname });

      alert('닉네임이 설정되었습니다. 포트폴리오 업로드 페이지로 이동합니다.');
      navigate(`/intro-upload`);

    } catch (error) {
      alert(error.response?.data?.message || '닉네임 설정 중 오류가 발생했습니다.');
    }
  };

  return (
    // 👇 [병합] 두 버전의 JSX를 통합하고, 에러 메시지 표시 로직을 추가합니다.
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