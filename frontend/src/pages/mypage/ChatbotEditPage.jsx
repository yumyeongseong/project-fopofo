import { useState, useCallback } from "react";
import { X, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MypageHeader from "../../components/MypageHeader";
import { pythonApi } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext"; 

// PDF.js 관련 import 및 설정은 현재 기능과 직접적인 관련이 없으므로,
// 코드의 복잡성을 줄이기 위해 우선 제외합니다. 필요 시 다시 추가할 수 있습니다.

export default function ChatbotEditPage() {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [activeTab, setActiveTab] = useState("intro");
    const [qaList, setQaList] = useState([
        { question: "자신의 강점이 잘 드러난 경험 하나를 소개해주세요.", answer: "" },
        { question: "가장 자신 있는 프로젝트 또는 작업 경험은 무엇인가요?", answer: "" },
        { question: "협업 중 기억에 남는 순간이나 갈등 해결 사례가 있다면요?", answer: "" },
        { question: "가장 힘들었지만 성장했다고 느낀 순간은 언제였나요?", answer: "" }
    ]);
    const [showMessage, setShowMessage] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleFiles = (incomingFiles) => {
        const validFiles = Array.from(incomingFiles).filter(
            (file) => file.type === "application/pdf" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        );
        if (validFiles.length !== incomingFiles.length) {
            alert("PDF 또는 DOCX 형식의 파일만 업로드하실 수 있습니다.");
        }
        setSelectedFiles(prevFiles => [...prevFiles, ...validFiles]);
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
    }, []);

    const handleDeleteFile = (fileToDelete) => {
        setSelectedFiles(prevFiles => prevFiles.filter(file => file !== fileToDelete));
    };
    
    const handleAnswerChange = (index, newAnswer) => {
        const updated = [...qaList];
        updated[index].answer = newAnswer;
        setQaList(updated);
    };
    
    const handleSaveQA = async () => {
        // 모든 답변이 입력되었는지 확인
        const allAnswered = qaList.every(item => item.answer.trim() !== '');
        if (!allAnswered) {
            alert("모든 질문에 답변을 입력해주세요.");
            return;
        }

        setIsProcessing(true);
        setShowMessage("Q&A를 저장하는 중입니다...");

        try {
            // 백엔드 API가 기대하는 형식으로 데이터를 변환합니다.
            // { question_1: "...", answer_1: "...", ... }
            const answersToSave = {};
            qaList.forEach((item, index) => {
                answersToSave[`question_${index + 1}`] = item.question;
                answersToSave[`answer_${index + 1}`] = item.answer;
            });

            // 백엔드의 /save-answers API를 호출합니다.
            // 이 API는 기존 데이터를 덮어쓰므로, 삭제 후 저장하는 효과가 있습니다.
            await pythonApi.post('/save-answers', {
                answers: answersToSave
            });

            setShowMessage("성공적으로 저장되었습니다.");
            setTimeout(() => {
                setShowMessage("");
                // 성공 후 챗봇을 바로 테스트할 수 있도록 메인 페이지로 이동
                navigate('/mypage');
            }, 2000);

        } catch (error) {
            console.error("Q&A 저장 중 오류 발생:", error.response?.data || error.message);
            setShowMessage("오류가 발생했습니다. 다시 시도해주세요.");
            setTimeout(() => setShowMessage(""), 3000);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleEdit = async () => {
        if (selectedFiles.length === 0) {
            alert("대체할 파일을 하나 이상 선택해주세요.");
            return;
        }
        setIsProcessing(true);
        setShowMessage("챗봇을 업데이트하는 중입니다...");
        try {
            // 1단계: 기존 Pinecone 벡터 데이터 삭제
            console.log("1단계: 기존 Pinecone 벡터 삭제를 시작합니다...");
            await pythonApi.delete('/pinecone-vectors');
            console.log("삭제 성공.");

            // 2단계: 새로 선택된 파일들을 업로드
            console.log(`2단계: 새로운 파일 ${selectedFiles.length}개를 업로드합니다...`);
            const uploadPromises = selectedFiles.map(file => {
                const formData = new FormData();
                formData.append('file', file);
                return pythonApi.post('/upload', formData);
            });
            
            // 모든 파일 업로드 및 서버 처리가 완료될 때까지 기다립니다.
            await Promise.all(uploadPromises);
            console.log("업로드 성공.");

            setShowMessage("챗봇이 성공적으로 업데이트되었습니다!");
            setTimeout(() => {
                setShowMessage("");
                // 3단계: 요청하신 대로 /mypage 경로로 이동합니다.
                navigate('/mypage');
            }, 2000);

        } catch (error) {
            console.error("챗봇 업데이트 중 오류 발생:", error.response?.data || error.message);
            setShowMessage("오류가 발생했습니다. 다시 시도해주세요.");
            setTimeout(() => setShowMessage(""), 3000);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-pink-100 flex flex-col relative">
            <MypageHeader/>

            {showMessage && (
                <div className="absolute bottom-[80px] left-1/2 transform -translate-x-1/2 bg-white text-black px-6 py-2 rounded-full shadow-md z-50 transition-opacity duration-300">
                    {showMessage}
                </div>
            )}

            <div className="flex flex-1 mt-6">
                <div className="flex flex-col gap-4 p-6">
                    <button onClick={() => setActiveTab("intro")} className={`border px-4 py-2 font-serif ${activeTab === "intro" ? "bg-white" : "bg-pink-50"}`}>챗봇 자기소개서 편집</button>
                    <button onClick={() => setActiveTab("qa")} className={`border px-4 py-2 font-serif ${activeTab === "qa" ? "bg-white" : "bg-pink-50"}`}>Q/A 수정</button>
                </div>

                {activeTab === "qa" ? (
                    <div className="flex-1 p-8">
                        <div className="bg-blue-100 rounded-lg p-8 w-full max-w-4xl mx-auto">
                            {qaList.map((item, index) => (
                                <div key={index} className="mb-6">
                                    <p className="font-semibold mb-2">Q. {item.question}</p>
                                    <textarea
                                        value={item.answer}
                                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                                        className="w-full border border-gray-300 rounded p-2 min-h-[80px]"
                                        placeholder="A."
                                    />
                                </div>
                            ))}
                            <button
                                onClick={handleSaveQA}
                                className="bg-pink-300 text-white px-6 py-2 rounded-full mt-6 hover:bg-pink-400 transition"
                            >
                                save
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 p-8 bg-blue-100 rounded-lg flex gap-6">
                        <div className="w-1/2 bg-pink-50 p-6 rounded flex flex-col items-center">
                            <p className="block mb-2 font-semibold">PDF 또는 DOCX 업로드</p>
                            <label
                                htmlFor="fileUpload"
                                className="bg-pink-300 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-pink-400 transition"
                            >
                                파일 선택
                            </label>
                            <input
                                id="fileUpload"
                                type="file"
                                accept=".pdf,.docx"
                                multiple
                                onChange={(e) => handleFiles(e.target.files)}
                                className="hidden"
                            />
                            <div className="mt-4 w-full space-y-2">
                                {selectedFiles.map((file, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between items-center px-4 py-2 rounded-md bg-white shadow-sm text-sm"
                                    >
                                        <span className="flex items-center gap-2 flex-1 truncate">
                                            <FileText size={16} className="text-gray-500" />
                                            {file.name}
                                        </span>
                                        <button
                                            onClick={() => handleDeleteFile(file)}
                                            className="ml-4 text-gray-500 hover:text-red-500"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={handleEdit}
                                disabled={isProcessing}
                                className="mt-6 bg-pink-200 text-brown-700 px-6 py-2 rounded-full shadow-sm hover:shadow-md transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                {isProcessing ? '업데이트 중...' : 'Edit'}
                            </button>
                        </div>

                        <div className="w-1/2 bg-white p-6 rounded shadow">
                            <p className="text-center font-bold mb-2">PREVIEW</p>
                            <div className="text-center text-gray-500 border p-4 rounded">
                                파일 미리보기는 현재 비활성화되어 있습니다.
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}