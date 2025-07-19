import { useState } from "react";
import MypageHeader from "../../components/MypageHeader";

const initialQA = [
    { question: "자신의 강점이 잘 드러난 경험 하나를 소개해주세요.", answer: "" },
    { question: "가장 자신 있는 프로젝트 또는 작업 경험은 무엇인가요?", answer: "" },
    { question: "협업 중 기억에 남는 순간이나 갈등 해결 사례가 있다면요?", answer: "" },
    { question: "가장 힘들었지만 성장했다고 느낀 순간은 언제였나요?", answer: "" },
];

export default function ChatbotEditPage() {
    const [activeSection, setActiveSection] = useState("intro");
    const [pdfUrl, setPdfUrl] = useState(null);
    const [qaList, setQaList] = useState(initialQA);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type === "application/pdf") {
            const fileUrl = URL.createObjectURL(file);
            setPdfUrl(fileUrl);
        }
    };

    const handleAnswerChange = (index, value) => {
        const updated = [...qaList];
        updated[index].answer = value;
        setQaList(updated);
    };

    return (
        <div className="min-h-screen bg-pink-100 flex flex-col">
            <MypageHeader />

            <div className="flex flex-1 mt-6">
                {/* Sidebar */}
                <div className="flex flex-col gap-4 p-6">
                    <button onClick={() => setActiveSection("intro")} className="border px-4 py-2 font-serif bg-pink-50">자기소개서 편집</button>
                    <button onClick={() => setActiveSection("resume")} className="border px-4 py-2 font-serif bg-pink-50">이력서 편집</button>
                    <button onClick={() => setActiveSection("chatbot")} className="border px-4 py-2 font-serif bg-pink-50">Q/A 수정</button>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-8 bg-blue-100 rounded-lg">
                    {activeSection === "chatbot" ? (
                        <div className="bg-pink-50 p-6 rounded shadow">
                            <h2 className="text-2xl font-serif mb-6 text-center">Q/A For Chatbot</h2>
                            {qaList.map((qa, index) => (
                                <div key={index} className="mb-6">
                                    <p className="font-semibold">Q. {qa.question}</p>
                                    <textarea
                                        value={qa.answer}
                                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                                        className="w-full mt-1 p-2 border rounded"
                                        rows={3}
                                    />
                                </div>
                            ))}
                            <button className="bg-pink-300 text-white px-6 py-2 rounded-full mt-4 mx-auto block">Save</button>
                        </div>
                    ) : (
                        <div className="flex gap-6">
                            <div className="w-1/2 bg-pink-50 p-6 rounded">
                                <label className="block mb-2 font-semibold">PDF 업로드</label>
                                <input type="file" accept="application/pdf" onChange={handleFileUpload} />
                            </div>
                            <div className="w-1/2 bg-white p-6 rounded shadow">
                                <p className="text-center font-bold mb-2">PREVIEW</p>
                                {pdfUrl ? (
                                    <iframe src={pdfUrl} className="w-full h-96 border" title="pdf-preview" />
                                ) : (
                                    <p className="text-center text-gray-500">업로드된 파일이 없습니다.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

