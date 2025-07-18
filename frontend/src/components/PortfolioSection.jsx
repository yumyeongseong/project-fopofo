// 👇 1. 함수가 props로 { portfolio } 를 받도록 수정합니다.
export default function PortfolioSection({ portfolio }) {
  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md border mt-10">
      <h2 className="text-xl font-semibold mb-4">📁 포트폴리오</h2>

      {/* 👇 2. portfolio 데이터(배열)가 있고, 내용이 1개 이상일 경우 목록으로 표시합니다. */}
      {portfolio && portfolio.length > 0 ? (
        <ul>
          {portfolio.map((item, index) => (
            <li key={index} className="mb-2">
              <a
                href={item.filePath} // 실제 파일 경로로 링크
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {item.originalName} {/* 파일의 원본 이름을 보여줍니다. */}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        // 👇 3. 데이터가 없을 경우 안내 문구를 보여줍니다.
        <p>포트폴리오 데이터가 없습니다.</p>
      )}
    </div>
  );
}