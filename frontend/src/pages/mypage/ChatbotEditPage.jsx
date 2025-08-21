// ChatbotEditPage.jsx (최종 수정된 전체 코드)

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, FileText } from 'lucide-react';
import { pythonApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import './ChatbotEditPage.css';
import PdfThumbnail from "../../components/PdfThumbnail";

export default function ChatbotEditPage() {
    const [selectedFile, setSelectedFile] = useState(null);
    // ✅ 미리보기를 위한 임시 URL을 저장할 state를 추가합니다.
    const [previewUrl, setPreviewUrl] = useState(null);
    
    // ... (나머지 state 변수들은 동일) ...
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
    const { user, logout } = useAuth();
    const fileInputRef = useRef(null);

    // ✅ 파일이 선택될 때, 원본 파일과 함께 미리보기용 URL을 생성합니다.
    const handleFile = useCallback((file) => {
        if (!file) return;
        if (file.type !== "application/pdf") {
            alert("PDF 형식의 파일만 업로드할 수 있습니다.");
            return;
        }
        setSelectedFile(file); // 원본 파일 저장
        setPreviewUrl(URL.createObjectURL(file)); // 미리보기용 URL 생성 및 저장
    }, []);
    
    // ✅ 컴포넌트가 언마운트될 때 생성된 URL을 메모리에서 해제하여 메모리 누수를 방지합니다.
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleDelete = () => {
        setSelectedFile(null);
        setPreviewUrl(null); // ✅ 미리보기 URL도 함께 초기화합니다.
    };

    const handleFileChange = (e) => { handleFile(e.target.files[0]); };
    const handleDrop = useCallback((e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }, [handleFile]);

    // handleEdit 함수는 이제 충돌 걱정 없이 selectedFile을 안전하게 사용할 수 있습니다.
    const handleEdit = async () => {
        if (!selectedFile) {
            alert("업데이트할 파일을 선택해주세요.");
            return;
        }
        setIsProcessing(true);
        setShowMessage("챗봇을 업데이트 중입니다...");
        try {
            await pythonApi.delete("/pinecone-vectors");
            const formData = new FormData();
            // new Blob()을 사용하는 것은 여전히 좋은 안전장치이므로 유지합니다.
            formData.append("file", new Blob([selectedFile]), selectedFile.name);
            await pythonApi.post("/upload", formData);
            
            setShowMessage("챗봇이 성공적으로 업데이트되었습니다!");
            setTimeout(() => {
                setShowMessage("");
                navigate("/mypage/chatbot");
            }, 2000);
        } catch (error) {
            console.error("챗봇 업데이트 실패:", error);
            setShowMessage("업데이트에 실패했습니다.");
            setTimeout(() => setShowMessage(""), 3000);
        } finally {
            setIsProcessing(false);
        }
    };

    // ... (handleSaveQA, handleLogout, useEffect 등 나머지 함수와 return 문은 기존 코드와 거의 동일) ...
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
        } catch (error) {
            console.error("Q&A 저장 중 오류:", error);
            setShowMessage("오류가 발생했습니다. 다시 시도해주세요.");
        } finally {
            setIsProcessing(false);
            setTimeout(() => setShowMessage(""), 2000);
        }
    };
    
    const handleLogout = () => { logout(); navigate('/mainpage'); };
    
    useEffect(() => {
        const fetchQA = async () => {
            if (activeTab === 'qa' && user?.userId) {
                try {
                    const response = await pythonApi.get(`/get-answers/${user.userId}`);
                    if (response.data && response.data.length > 0) {
                        const newQaList = [...qaList];
                        response.data.forEach(savedAnswer => {
                            const questionIndex = newQaList.findIndex(q => q.question === savedAnswer.question);
                            if (questionIndex > -1) {
                                newQaList[questionIndex].answer = savedAnswer.answer;
                            }
                        });
                        setQaList(newQaList);
                    }
                } catch (error) {
                    console.error("저장된 답변을 불러오는데 실패했습니다:", error);
                }
            }
        };
        fetchQA();
    }, [activeTab, user]);

    return (
        <div className="chatbot-edit-page">
            {/* ... 헤더 부분 ... */}
            <img src="/Fopofo-Logo-v2.png" alt="FoPoFo Logo" className="intro-logo" onClick={() => navigate("/mainpage")} />
            <div className="intro-buttons">
                <button className="outline-btn" onClick={() => navigate("/mypage")}>←</button>
                <button className="outline-btn" onClick={handleLogout}>logout</button>
                <button className="outline-btn" onClick={() => navigate("/home")}>home</button>
            </div>
            <h1 className="mpage-title">Edit Chatbot</h1>
            {showMessage && <div className="message-popup">{showMessage}</div>}

            <div className="tab-sidebar">
                <button onClick={() => setActiveTab("intro")} className={activeTab === "intro" ? "active" : ""}>챗봇 문서 편집</button>
                <button onClick={() => setActiveTab("qa")} className={activeTab === "qa" ? "active" : ""}>Q/A 수정</button>
            </div>

            {activeTab === 'qa' ? (
                // ... Q&A 탭 UI ...
                <div className="qa-section">
                    <div className="qa-box">
                        {qaList.map((item, index) => (
                            <div key={index} className="qa-item">
                                <p>Q. {item.question}</p>
                                <textarea value={item.answer} onChange={(e) => handleAnswerChange(index, e.target.value)} placeholder="A. 여기에 답변을 입력해주세요" />
                            </div>
                        ))}
                        <button onClick={handleSaveQA} disabled={isProcessing} className="save-button">{isProcessing ? "저장 중..." : "답변 저장하기"}</button>
                    </div>
                </div>
            ) : (
                <div className="file-section" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
                    {/* ... 파일 업로드 UI ... */}
                    <div className="file-upload-box">
                        <p className="file-label">📄 파일 선택 (PDF만 가능)</p>
                        <label htmlFor="fileUpload" className="upload-button" onClick={() => { if (fileInputRef.current) { fileInputRef.current.value = null; } }}>
                            파일 선택
                        </label>
                        <input id="fileUpload" type="file" accept=".pdf" onChange={handleFileChange} ref={fileInputRef} style={{ display: 'none' }} />
                        <div className="file-list">
                            {selectedFile && (
                                <div className="file-item">
                                    <span className="file-name"><FileText size={16} /> {selectedFile.name}</span>
                                    <button onClick={handleDelete} className="delete-button"><X size={16} /></button>
                                </div>
                            )}
                        </div>
                        <button onClick={handleEdit} disabled={isProcessing} className="edit-button">
                            {isProcessing ? "업데이트 중..." : "Edit"}
                        </button>
                    </div>
                    <div className="file-preview-box">
                        <p className="preview-title">PREVIEW</p>
                        {previewUrl ? ( // ✅ file 객체 대신 previewUrl을 사용합니다.
                            <PdfThumbnail file={previewUrl} width={300} />
                        ) : (
                            <div className="preview-placeholder">선택한 파일의 첫 페이지 미리보기가 여기에 표시됩니다.</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}