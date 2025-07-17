from fastapi import FastAPI, UploadFile, File, Depends
from user_answers import save_user_answers, get_user_answers
from llm import store_document_vectors
from rag_chatbot import get_chatbot_response
from auth import get_current_user
from typing import Dict
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from chatbot_manager import router as chatbot_router
import os
import json

class AnswersRequest(BaseModel):
    answers: Dict[str, str]

app = FastAPI()

app.include_router(chatbot_router)

@app.get("/")
async def read_root():
    return {"message": "안녕하세요! 챗봇 API 서버입니다."}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # ✅ 수정된 부분: 프런트엔드 주소로 변경 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

### 챗봇 문서 업로드
@app.post("/upload")
async def upload(file: UploadFile = File(...), user_id: str = Depends(get_current_user)):
    file_path = f"user_files/{user_id}_{file.filename}"
    with open(file_path, "wb") as f:
        f.write(await file.read())
    store_document_vectors(file_path, user_id)
    return {"message": "문서 업로드 및 벡터 저장 완료"}


### 개발자 질문 답변 저장 기능
@app.post("/save-answers")
async def save_answers_api(request: AnswersRequest, user_id: str = Depends(get_current_user)):
    save_user_answers(user_id, request.answers)
    return {"message": "질문 답변 저장 완료"}


### 내 질문 답변 확인
@app.get("/get-answers/{user_id}")
async def get_answers_api(user_id: str):
    answers = get_user_answers(user_id)
    return {"user_id": user_id, "answers": answers}

class ChatRequest(BaseModel):
    query: str


### 
@app.post("/chat")
async def chat(request: ChatRequest, user_id: str = Depends(get_current_user)):
    response = get_chatbot_response(request.query, user_id)
    return {"response": response}