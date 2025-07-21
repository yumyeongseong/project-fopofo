from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from typing import Dict
from pydantic import BaseModel

# ✅ 상대경로 import 그대로 유지
from .user_answers import save_user_answers, get_user_answers
from .llm import store_document_vectors
from .rag_chatbot import get_chatbot_response
from .auth import get_current_user
from .chatbot_manager import router as chatbot_router
from .utils import get_predefined_questions

import os

app = FastAPI()

# ✅ CORS 설정 (프론트엔드에서 요청 허용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ 라우터 등록
app.include_router(chatbot_router)


@app.get("/")
async def read_root():
    return {"message": "안녕하세요! 챗봇 API 서버입니다."}


# ✅ 파일 업로드 후 Pinecone 벡터 저장
@app.post("/upload")
async def upload(file: UploadFile = File(...), user_id: str = Depends(get_current_user)):
    file_path = f"user_files/{user_id}_{file.filename}"
    try:
        with open(file_path, "wb") as f:
            f.write(await file.read())
        store_document_vectors(file_path, user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"'{file.filename}' 처리 중 오류 발생: {str(e)}")
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)
    return {"message": "문서 업로드 및 벡터 저장 완료"}


# ✅ 질문 답변 저장용 모델
class AnswersRequest(BaseModel):
    answers: Dict[str, str]


@app.post("/save-answers")
async def save_answers_api(request: AnswersRequest, user_id: str = Depends(get_current_user)):
    received_data = request.answers
    predefined_questions = get_predefined_questions()

    answers_list_to_save = []
    for i, q_map in enumerate(predefined_questions):
        q_key = f"question_{i + 1}"
        a_key = f"answer_{i + 1}"
        if q_key in received_data and a_key in received_data:
            answers_list_to_save.append({
                "question": q_map["short_text"],
                "answer": received_data[a_key]
            })

    save_user_answers(user_id, answers_list_to_save)
    return {"message": "질문 답변 저장 완료"}


@app.get("/get-answers/{user_id}")
async def get_answers_api(user_id: str):
    answers = get_user_answers(user_id)
    return {"user_id": user_id, "answers": answers}


# ✅ 챗봇 질의 응답 모델
class ChatRequest(BaseModel):
    query: str


@app.post("/chat")
async def chat(request: ChatRequest, user_id: str = Depends(get_current_user)):
    response = get_chatbot_response(request.query, user_id)
    return {"response": response}


# ✅ 포트폴리오 URL 생성
@app.post("/generate-portfolio-url")
async def generate_portfolio_url(user_id: str = Depends(get_current_user)):
    base_frontend_url = "http://localhost:3000/user"
    portfolio_display_url = f"{base_frontend_url}/{user_id}"
    return {"portfolio_url": portfolio_display_url}
