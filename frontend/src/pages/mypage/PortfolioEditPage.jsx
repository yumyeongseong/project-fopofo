import { useState } from "react";
import { Plus, Trash, CheckCircle, Circle } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import { GlobalWorkerOptions } from "pdfjs-dist/build/pdf";
import { useNavigate } from "react-router-dom";
import MypageHeader from "../../components/MypageHeader";

GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.js`;

export default function PortfolioEditPage() {
    const [category, setCategory] = useState("Design");
    const [items, setItems] = useState({ Design: [], Video: [], Document: [], Photo: [] });
    const [selected, setSelected] = useState([]);
    const navigate = useNavigate();

    const renderPDFThumbnail = async (file) => {
        const reader = new FileReader();
        return new Promise((resolve) => {
            reader.onload = async () => {
                const typedarray = new Uint8Array(reader.result);
                const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
                const page = await pdf.getPage(1);
                const viewport = page.getViewport({ scale: 1 });
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                await page.render({ canvasContext: context, viewport }).promise;
                resolve(canvas.toDataURL("image/png"));
            };
            reader.readAsArrayBuffer(file);
        });
    };

    const handleCategoryClick = (type) => {
        setCategory(type);
        setSelected([]);
    };

    const handleFileInput = async (e) => {
        const newFiles = Array.from(e.target.files);
        const processed = await Promise.all(
            newFiles.map(async (file) => {
                if (file.type === "application/pdf") {
                    const thumbnail = await renderPDFThumbnail(file);
                    return { file, thumbnail };
                } else {
                    return { file, thumbnail: URL.createObjectURL(file) };
                }
            })
        );
        setItems((prev) => ({ ...prev, [category]: [...prev[category], ...processed] }));
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        const newFiles = Array.from(e.dataTransfer.files);
        const processed = await Promise.all(
            newFiles.map(async (file) => {
                if (file.type === "application/pdf") {
                    const thumbnail = await renderPDFThumbnail(file);
                    return { file, thumbnail };
                } else {
                    return { file, thumbnail: URL.createObjectURL(file) };
                }
            })
        );
        setItems((prev) => ({ ...prev, [category]: [...prev[category], ...processed] }));
    };

    const handleSelect = (file) => {
        setSelected((prev) =>
            prev.includes(file) ? prev.filter((f) => f !== file) : [...prev, file]
        );
    };

    const handleDelete = () => {
        setItems((prev) => ({
            ...prev,
            [category]: prev[category].filter((f) => !selected.includes(f.file)),
        }));
        setSelected([]);
    };

    const handleEdit = () => {
        console.log("최종 저장:", items[category]);
    };

    return (
        <div className="min-h-screen bg-pink-100 flex flex-col">
            <MypageHeader />


            <div className="flex flex-1">
                {/* 왼쪽 카테고리 */}
                <div className="flex flex-col gap-4 p-6">
                    {["Design", "Video", "Document", "Photo"].map((type) => (
                        <button
                            key={type}
                            onClick={() => handleCategoryClick(type)}
                            className={`border px-4 py-2 font-serif ${category === type ? "bg-white" : "bg-pink-50"}`}
                        >
                            {type}
                        </button>
                    ))}

                    <label className="bg-pink-300 text-white text-center py-2 rounded-full cursor-pointer">
                        <input type="file" multiple hidden onChange={handleFileInput} />
                        Add
                    </label>
                    <button onClick={handleDelete} className="bg-pink-300 text-white text-center py-2 rounded-full">
                        Delete
                    </button>
                    <button onClick={handleEdit} className="bg-pink-200 text-brown-700 text-center py-2 rounded-full shadow hover:shadow-md transition">
                        Edit
                    </button>
                </div>

                {/* 오른쪽 미리보기 */}
                <div
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="flex-1 p-8 grid grid-cols-3 gap-4 bg-blue-100 rounded-lg"
                >
                    {items[category].map(({ file, thumbnail }, index) => (
                        <div
                            key={index}
                            className="relative rounded overflow-hidden shadow-md cursor-pointer"
                            onClick={() => handleSelect(file)}
                        >
                            <div className="absolute top-2 left-2 text-white">
                                {selected.includes(file) ? (
                                    <CheckCircle size={20} className="text-white bg-black rounded-full" />
                                ) : (
                                    <Circle size={20} className="text-white bg-black rounded-full" />
                                )}
                            </div>
                            {file.type.startsWith("video") ? (
                                <video src={thumbnail} controls className="w-full h-[200px] object-contain" />
                            ) : (
                                <img src={thumbnail} alt={file.name} className="w-full h-[200px] object-contain" />
                            )}
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}


