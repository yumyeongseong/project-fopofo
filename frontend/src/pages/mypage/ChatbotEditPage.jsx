import { useState, useCallback } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { GlobalWorkerOptions } from "pdfjs-dist/build/pdf";
import { X, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MypageHeader from "../../components/MypageHeader";

GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.js`;

export default function IntroEditPage() {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewFile, setPreviewFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [activeTab, setActiveTab] = useState("resume");
    const [qaList, setQaList] = useState([
        { question: "자신의 강점이 잘 드러난 경험 하나를 소개해주세요.", answer: "" },
        { question: "가장 자신 있는 프로젝트 또는 작업 경험은 무엇인가요?", answer: "" },
        { question: "협업 중 기억에 남는 순간이나 갈등 해결 사례가 있다면요?", answer: "" },
        { question: "가장 힘들었지만 성장했다고 느낀 순간은 언제였나요?", answer: "" }
    ]);
    const [showMessage, setShowMessage] = useState("");

    const renderPDFPreviewFirstPage = async (file) => {
        const reader = new FileReader();
        return new Promise((resolve) => {
            reader.onload = async () => {
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

    const handleDrop = useCallback(
        (e) => {
            e.preventDefault();
            handleFiles(e.dataTransfer.files);
        },
        [selectedFiles]
    );

    const handleFileClick = async (file) => {
        const preview = await renderPDFPreviewFirstPage(file);
        setPreviewFile(file);
        setPreviewImage(preview);
    };

    const handleDelete = async (fileToDelete) => {
        const updatedFiles = selectedFiles.filter((file) => file !== fileToDelete);
        setSelectedFiles(updatedFiles);

        if (updatedFiles.length > 0) {
            const newPreview = await renderPDFPreviewFirstPage(updatedFiles[0]);
            setPreviewFile(updatedFiles[0]);
            setPreviewImage(newPreview);
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

    const handleSaveQA = () => {
        console.log("저장된 Q/A:", qaList);
        setShowMessage("저장되었습니다.");
        setTimeout(() => setShowMessage(""), 2000);
    };

    const handleEdit = () => {
        console.log("업로드할 파일들:", selectedFiles);
        setShowMessage("업로드되었습니다.");
        setTimeout(() => setShowMessage(""), 2000);
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
                    <button onClick={() => setActiveTab("intro")} className={`border px-4 py-2 font-serif ${activeTab === "intro" ? "bg-white" : "bg-pink-50"}`}>자기소개서 편집</button>
                    <button onClick={() => setActiveTab("resume")} className={`border px-4 py-2 font-serif ${activeTab === "resume" ? "bg-white" : "bg-pink-50"}`}>이력서 편집</button>
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
                            <label className="block mb-2 font-semibold">PDF 업로드</label>
                            <label
                                htmlFor="fileUpload"
                                className="bg-pink-300 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-pink-400 transition"
                            >
                                파일 선택
                            </label>
                            <input
                                id="fileUpload"
                                type="file"
                                accept="application/pdf"
                                multiple
                                onChange={(e) => handleFiles(e.target.files)}
                                className="hidden"
                            />
                            <div className="mt-4 w-full space-y-2">
                                {selectedFiles.map((file, index) => (
                                    <div
                                        key={index}
                                        className={`flex justify-between items-center px-4 py-2 rounded-md transition text-sm cursor-pointer ${previewFile?.name === file.name ? "bg-white font-semibold shadow" : "text-gray-700 hover:bg-white hover:shadow"}`}
                                    >
                                        <span onClick={() => handleFileClick(file)} className="flex items-center gap-2 flex-1">
                                            <FileText size={16} className="text-gray-500" />
                                            {file.name}
                                        </span>
                                        <button
                                            onClick={() => handleDelete(file)}
                                            className="ml-4 text-gray-500 hover:text-red-500"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={handleEdit}
                                className="mt-6 bg-pink-200 text-brown-700 px-6 py-2 rounded-full shadow-sm hover:shadow-md transition"
                            >
                                Edit
                            </button>
                        </div>

                        <div className="w-1/2 bg-white p-6 rounded shadow">
                            <p className="text-center font-bold mb-2">PREVIEW</p>
                            {previewImage ? (
                                <img
                                    src={previewImage}
                                    alt={previewFile?.name}
                                    className="w-full max-h-[600px] mx-auto rounded-md shadow"
                                />
                            ) : (
                                <div className="text-center text-gray-500 border p-4 rounded">
                                    여기에 선택한 PDF 미리보기가 표시됩니다.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}





