import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// ✅ 1. 두 서버와 통신하기 위해 nodeApi와 pythonApi를 모두 import 합니다.
import { nodeApi, pythonApi } from '../services/api';

const IntroUploadPage = () => {
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const isAllPdf = selectedFiles.every((file) => file.type === 'application/pdf');

    if (!isAllPdf) {
      alert('PDF 파일만 업로드 가능합니다.');
      return;
    }
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNextClick = async () => {
    if (files.length === 0) {
      alert('파일을 하나 이상 업로드해주세요.');
      return;
    }

    try {
      // ✅ 2. Python 챗봇 서버로 파일을 보내는 부분입니다.
      const pythonUploadPromises = files.map(file => {
        const formData = new FormData();
        formData.append('file', file);
        return pythonApi.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      });

      // ✅ 3. Node.js 메인 서버로 파일을 보내는 부분입니다. (화면 표시용)
      // 여기서는 파일 타입을 'document'로 지정하여 보냅니다.
      const nodeUploadPromises = files.map(file => {
        const formData = new FormData();
        formData.append('file', file);
        return nodeApi.post('/upload/document', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      });

      // ✅ 4. 양쪽 서버에 모든 파일이 업로드될 때까지 기다립니다.
      await Promise.all([...pythonUploadPromises, ...nodeUploadPromises]);

      alert('파일 업로드가 완료되었습니다.');
      navigate('/upload'); // 다음 페이지로 이동
    } catch (error) {
      console.error('업로드 실패:', error);
      alert('업로드 중 오류가 발생했습니다.');
    }
  };

  // --- 아래 JSX 부분은 기존과 동일합니다 ---
  return (
    <div className="min-h-screen bg-white p-10 font-['Noto_Serif_KR']">
      <div className="flex justify-between items-center mb-12">
        <img
          src="/images/fopofo-logo.png"
          alt="FoPoFo Logo"
          className="w-[140px] cursor-pointer"
          onClick={() => navigate('/')}
        />
        <button
          onClick={() => navigate('/mypage')}
          className="font-['Courier_New'] text-[22px] bg-transparent text-[#2b1e28] border-2 border-[#f48ca2] px-5 py-2 rounded-md shadow-md transition-all duration-300 text-shadow-sm cursor-pointer mt-8 mr-4"
        >
          my page
        </button>
      </div>
      <h2 className="text-5xl md:text-6xl font-semibold mb-10 text-pink-300 tracking-widest drop-shadow">
        Please upload your resume files
      </h2>
      <div className="bg-pink-100 border border-gray-300 shadow-sm p-10 w-full max-w-4xl mx-auto">
        <p className="text-lg font-semibold mb-1">자기소개서 및 이력서를 업로드해주세요.</p>
        <p className="text-sm text-gray-600 mb-6">
          (특이사항 및 강조하고 싶은 내용 업로드 시 <br />
          특정질문에 대하여 자세하게 답변할 수 있습니다.)
        </p>
        <div className="bg-white shadow px-6 py-4 rounded-md flex flex-col items-center w-full">
          <label className="bg-pink-200 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer hover:bg-pink-300">
            파일 선택 (PDF만 가능)
            <input
              type="file"
              accept=".pdf"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
          <div className="mt-6 w-full max-h-40 overflow-y-auto border rounded-md p-3 bg-pink-50">
            {files.length === 0 ? (
              <p className="text-sm text-gray-400 text-center">선택된 파일이 없습니다.</p>
            ) : (
              files.map((file, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center text-sm text-gray-800 mb-2"
                >
                  <span className="truncate w-11/12">{file.name}</span>
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="ml-2 text-gray-500 hover:text-red-500 transition-colors duration-200 text-lg"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-12">
        <button
          onClick={handleNextClick}
          className="bg-pink-200 px-10 py-2 text-xl rounded-full shadow hover:bg-pink-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default IntroUploadPage;