import os
from docx import Document
from PyPDF2 import PdfReader

def extract_text_from_file(file_path: str) -> str:
    ext = os.path.splitext(file_path)[1].lower()
    text = ""

    if ext == ".pdf":
        with open(file_path, "rb") as f:
            reader = PdfReader(f)
            for page in reader.pages:
                text += page.extract_text() or ""
    elif ext == ".docx":
        doc = Document(file_path)
        for para in doc.paragraphs:
            text += para.text + "\n"
    elif ext == ".txt":
        with open(file_path, "r", encoding="utf-8") as f:
            text = f.read()
    else:
        raise ValueError(f"지원하지 않는 파일 형식입니다: {ext}")

    return text.strip()

def get_predefined_questions() -> list:
    return [
        "자신의 강점이 잘 드러난 경험 하나를 소개해주세요",
        "가장 자신 있는 프로젝트 혹은 작업 경험은 무엇인가요?",
        "협업 중, 기억에 남은 순간이나 갈등 해결 사례가 있나요?",
        "가장 힘들었지만, 성장했다고 느낀 순간은 언제였나요?"
    ]
