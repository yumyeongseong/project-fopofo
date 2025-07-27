import { useState, useCallback } from "react";
import { X, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MypageHeader from "../../components/MypageHeader";
import { pythonApi } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import * as pdfjsLib from "pdfjs-dist";
import { GlobalWorkerOptions } from "pdfjs-dist";

GlobalWorkerOptions.workerSrc = `/pdf.worker.mjs`;

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

  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);

  const renderPDFPreview = async (file) => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        try {
          const typedarray = new Uint8Array(reader.result);
          const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
          const page = await pdf.getPage(1);
          const viewport = page.getViewport({ scale: 1.2 });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          await page.render({ canvasContext: context, viewport }).promise;
          resolve(canvas.toDataURL("image/png"));
        } catch (error) {
          console.error("PDF 미리보기 생성 실패:", error);
          reject(error);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const handleFiles = async (incomingFiles) => {
    const validFiles = Array.from(incomingFiles).filter(
      (file) => file.type === "application/pdf" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    if (validFiles.length !== incomingFiles.length) {
      alert("PDF 또는 DOCX 형식의 파일만 업로드하실 수 있습니다.");
    }

    const newFiles = [...selectedFiles, ...validFiles];
    setSelectedFiles(newFiles);

    if (validFiles.length > 0) {
      const latestFile = validFiles[validFiles.length - 1];
      setPreviewFile(latestFile);
      if (latestFile.type === "application/pdf") {
        try {
          const url = await renderPDFPreview(latestFile);
          setPreviewUrl(url);
        } catch (error) { setPreviewUrl(null); }
      } else { setPreviewUrl(null); }
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  }, [selectedFiles]);

  const handleDeleteFile = (fileToDelete) => {
    const updatedFiles = selectedFiles.filter(file => file !== fileToDelete);
    setSelectedFiles(updatedFiles);

    if (previewFile === fileToDelete) {
      if (updatedFiles.length > 0) {
        const nextPreviewFile = updatedFiles[0];
        setPreviewFile(nextPreviewFile);
        if (nextPreviewFile.type === "application/pdf") {
          renderPDFPreview(nextPreviewFile).then(setPreviewUrl).catch(() => setPreviewUrl(null));
        } else { setPreviewUrl(null); }
      } else {
        setPreviewFile(null);
        setPreviewUrl(null);
      }
    }
  };

  const handleAnswerChange = (index, newAnswer) => {
    const updatedQaList = [...qaList];
    updatedQaList[index].answer = newAnswer;
    setQaList(updatedQaList);
  };

  const handleSaveQA = async () => {
    const allAnswered = qaList.every(item => item.answer.trim() !== '');
    if (!allAnswered) {
      alert("모든 질문에 답변을 입력해주세요.");
      return;
    }
    setIsProcessing(true);
    setShowMessage("Q&A를 저장하는 중입니다...");
    try {
      const answersToSave = {};
      qaList.forEach((item, index) => {
        answersToSave[`question_${index + 1}`] = item.question;
        answersToSave[`answer_${index + 1}`] = item.answer;
      });
      await pythonApi.post('/save-answers', { answers: answersToSave });
      setShowMessage("성공적으로 저장되었습니다.");
      setTimeout(() => {
        setShowMessage("");
        navigate('/mypage');
      }, 2000);
    } catch (error) {
      console.error("Q&A 저장 중 오류 발생:", error);
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
      await pythonApi.delete('/pinecone-vectors');
      const uploadPromises = selectedFiles.map(file => {
        const formData = new FormData();
        formData.append('file', file);
        return pythonApi.post('/upload', formData);
      });
      await Promise.all(uploadPromises);
      setShowMessage("챗봇이 성공적으로 업데이트되었습니다!");
      setTimeout(() => {
        setShowMessage("");
        navigate('/mypage');
      }, 2000);
    } catch (error) {
      console.error("챗봇 업데이트 중 오류 발생:", error);
      setShowMessage("오류가 발생했습니다. 다시 시도해주세요.");
      setTimeout(() => setShowMessage(""), 3000);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-pink-100 flex flex-col relative">
      <MypageHeader />

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
          // ▼▼▼▼▼ 사라졌던 Q/A 수정 UI를 여기에 다시 추가합니다. ▼▼▼▼▼
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
                disabled={isProcessing}
                className="bg-pink-300 text-white px-6 py-2 rounded-full mt-6 hover:bg-pink-400 transition disabled:bg-gray-300"
              >
                {isProcessing ? '저장 중...' : 'save'}
              </button>
            </div>
          </div>
          // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
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
              <div className="text-center text-gray-500 border p-4 rounded min-h-[300px] flex items-center justify-center">
                {previewUrl ? (
                  <img src={previewUrl} alt="PDF preview" className="max-w-full max-h-full object-contain" />
                ) : previewFile ? (
                  <div className="flex flex-col items-center">
                    <FileText size={48} className="text-gray-400" />
                    <p className="mt-2 text-sm break-all">{previewFile.name}</p>
                  </div>
                ) : (
                  "파일 미리보기는 현재 비활성화되어 있습니다."
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}