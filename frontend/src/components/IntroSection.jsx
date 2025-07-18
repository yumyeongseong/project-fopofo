// 👇 1. 함수가 props로 { intro } 를 받도록 수정합니다.
export default function IntroSection({ intro }) {
  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md border mt-10">
      <h2 className="text-xl font-semibold mb-4">자기소개서</h2>
      {/* 👇 2. 하드코딩된 문장 대신, props로 받은 intro 데이터를 표시합니다. */}
      {/* 데이터가 없을 경우를 대비해 안내 문구를 보여줍니다. */}
      <p className="whitespace-pre-line">
        {intro ? intro : "자기소개 데이터가 없습니다."}
      </p>
    </div>
  );
}