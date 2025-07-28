// ChatbotEditPage.jsx
import { useState, useCallback } from "react";
import { X, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { pythonApi } from "../../services/api";
import * as pdfjsLib from "pdfjs-dist";
import { GlobalWorkerOptions } from "pdfjs-dist";
import "./ChatbotEditPage.css";

GlobalWorkerOptions.workerSrc = `/pdf.worker.mjs`;

export default function ChatbotEditPage() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewFile, setPreviewFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
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

  const renderPDFPreviewFirstPage = async (file) => {
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

          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({ canvasContext: context, viewport }).promise;
          const imageData = canvas.toDataURL("image/png");
          resolve(imageData);
        } catch (err) {
          reject(err);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const handleFiles = async (incomingFiles) => {
    const validFiles = Array.from(incomingFiles).filter(
      (file) => file.type === "application/pdf"
    );

    if (validFiles.length !== incomingFiles.length) {
      alert("PDF 형식의 파일만 업로드하실 수 있습니다.");
    }

    const newList = [...selectedFiles, ...validFiles];
    setSelectedFiles(newList);

    const latestFile = validFiles[validFiles.length - 1];
    if (latestFile) {
      const preview = await renderPDFPreviewFirstPage(latestFile);
      setPreviewFile(latestFile);
      setPreviewImage(preview);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  }, [selectedFiles]);

  const handleFileClick = async (file) => {
    const preview = await renderPDFPreviewFirstPage(file);
    setPreviewFile(file);
    setPreviewImage(preview);
  };

  const handleDelete = async (fileToDelete) => {
    const updatedFiles = selectedFiles.filter((file) => file !== fileToDelete);
    setSelectedFiles(updatedFiles);

    if (updatedFiles.length > 0) {
      const next = updatedFiles[0];
      const preview = await renderPDFPreviewFirstPage(next);
      setPreviewFile(next);
      setPreviewImage(preview);
    } else {
      setPreviewFile(null);
      setPreviewImage(null);
    }
  };

  const handleAnswerChange = (index, newAnswer) => {
    const updated = [...qaList];
    updated[index].answer = newAnswer;
    setQaList(updated);
  };

  const handleSaveQA = async () => {
    const allAnswered = qaList.every((item) => item.answer.trim() !== "");
    if (!allAnswered) {
      alert("모든 질문에 답변을 입력해주세요.");
      return;
    }
    setIsProcessing(true);
    setShowMessage("Q&A 저장 중...");

    try {
      const answersToSave = {};
      qaList.forEach((item, index) => {
        answersToSave[`question_${index + 1}`] = item.question;
        answersToSave[`answer_${index + 1}`] = item.answer;
      });

      await pythonApi.post("/save-answers", { answers: answersToSave });

      setShowMessage("성공적으로 저장되었습니다!");
      setTimeout(() => {
        setShowMessage("");
        navigate("/mypage");
      }, 2000);
    } catch (error) {
      console.error("Q&A 저장 중 오류:", error);
      setShowMessage("오류가 발생했습니다. 다시 시도해주세요.");
      setTimeout(() => setShowMessage(""), 3000);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEdit = async () => {
    if (selectedFiles.length === 0) {
      alert("업로드할 파일을 선택해주세요.");
      return;
    }
    setIsProcessing(true);
    setShowMessage("챗봇을 업데이트 중입니다...");

    try {
      await pythonApi.delete("/pinecone-vectors");
      const uploadPromises = selectedFiles.map((file) => {
        const formData = new FormData();
        formData.append("file", file);
        return pythonApi.post("/upload", formData);
      });
      await Promise.all(uploadPromises);
      setShowMessage("챗봇이 성공적으로 업데이트되었습니다!");
      setTimeout(() => {
        setShowMessage("");
        navigate("/mypage");
      }, 2000);
    } catch (error) {
      console.error("챗봇 업데이트 실패:", error);
      setShowMessage("업데이트에 실패했습니다.");
      setTimeout(() => setShowMessage(""), 3000);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="chatbot-edit-page">
      {/* ✅ 포포포 로고 & 버튼 영역 */}
      <img
        src="/Fopofo-Logo-v2.png"
        alt="FoPoFo Logo"
        className="intro-logo"
        onClick={() => navigate("/")}
      />
      <div className="intro-buttons">
        <button className="outline-btn" onClick={() => navigate("/mypage")}>←</button>
        <button className="outline-btn" onClick={() => navigate("/")}>logout</button>
        <button className="outline-btn" onClick={() => navigate("/home")}>home</button>
      </div>

      {/* ✅ 상단 중앙 My Page 문구 */}
      <h1 className="mpage-title fade-in">My Page</h1>

      {showMessage && <div className="message-popup">{showMessage}</div>}

      <div className="tab-sidebar fade-in">
        <button onClick={() => setActiveTab("intro")} className={activeTab === "intro" ? "active" : ""}>챗봇 문서 편집</button>
        <button onClick={() => setActiveTab("qa")} className={activeTab === "qa" ? "active" : ""}>Q/A 수정</button>
      </div>

      {activeTab === "qa" ? (
        <div className="qa-section fade-in">
          <div className="qa-box">
            {qaList.map((item, index) => (
              <div key={index} className="qa-item fade-in">
                <p>Q. {item.question}</p>
                <textarea
                  value={item.answer}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  placeholder="A. 여기에 답변을 입력해주세요"
                />
              </div>
            ))}
            <button onClick={handleSaveQA} disabled={isProcessing} className="save-button">
              {isProcessing ? "저장 중..." : "Edit"}
            </button>
          </div>
        </div>
      ) : (
        <div className="file-section fade-in" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
          <div className="file-upload-box fade-in">
            <p className="file-label">📄 파일 선택 (PDF만 가능)</p>
            <label htmlFor="fileUpload" className="upload-button">파일 선택</label>
            <input id="fileUpload" type="file" accept=".pdf" multiple onChange={(e) => handleFiles(e.target.files)} className="hidden" />
            <div className="file-list fade-in">
              {selectedFiles.map((file, index) => (
                <div key={index} className={`file-item ${previewFile?.name === file.name ? "active" : ""}`}>
                  <span onClick={() => handleFileClick(file)} className="file-name fade-in">
                    <FileText size={16} /> {file.name}
                  </span>
                  <button onClick={() => handleDelete(file)} className="delete-button">
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
            <button onClick={handleEdit} disabled={isProcessing} className="edit-button">
              {isProcessing ? "업데이트 중..." : "Edit"}
            </button>
          </div>
          <div className="file-preview-box fade-in">
            <p className="preview-title fade-in">PREVIEW</p>
            {previewImage ? (
              <img src={previewImage} alt={previewFile?.name} className="preview-image" />
            ) : (
              <div className="preview-placeholder fade-in">
                선택한 파일의 첫 페이지 미리보기가 여기에 표시됩니다.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
