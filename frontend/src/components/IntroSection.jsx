export default function IntroSection({ type, fileUrl }) {
  if (!fileUrl) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 text-gray-400 text-center">
        파일이 업로드되지 않았습니다 😥
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">{type === "intro" ? "자기소개서" : "이력서"}</h2>
      <iframe
        src={fileUrl}
        title={type}
        className="w-full h-[600px] rounded border"
      />
    </div>
  );
}