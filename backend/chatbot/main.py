from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from user_answers import save_user_answers, get_user_answers
from llm import store_document_vectors
from rag_chatbot import get_chatbot_response
from auth import get_current_user
# 👇 1. List 타입을 사용하기 위해 추가합니다.
from typing import Dict, List
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from chatbot_manager import router as chatbot_router
import os
import json
import uuid

# 👇 2. AnswersRequest 모델이 이제 객체들의 '리스트'를 받도록 수정합니다.
class AnswersRequest(BaseModel):
    answers: List[Dict[str, str]]

app = FastAPI()

app.include_router(chatbot_router)

@app.get("/")
async def read_root():
    return {"message": "안녕하세요! 챗봇 API 서버입니다."}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

### 챗봇 문서 업로드
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

### 개발자 질문 답변 저장 기능
@app.post("/save-answers")
async def save_answers_api(request: AnswersRequest, user_id: str = Depends(get_current_user)):
    # request.answers가 이미 올바른 리스트 형태이므로, 변환 없이 바로 전달합니다.
    save_user_answers(user_id, request.answers)
    return {"message": "질문 답변 저장 완료"}


### 내 질문 답변 확인
@app.get("/get-answers/{user_id}")
async def get_answers_api(user_id: str):
    answers = get_user_answers(user_id)
    return {"user_id": user_id, "answers": answers}

class ChatRequest(BaseModel):
    query: str


### 챗봇과 대화
@app.post("/chat")
async def chat(request: ChatRequest, user_id: str = Depends(get_current_user)):
    response = get_chatbot_response(request.query, user_id)
    return {"response": response}

### 포트폴리오 URL 생성
@app.post("/generate-portfolio-url")
async def generate_portfolio_url(user_id: str = Depends(get_current_user)):
    base_frontend_url = "http://localhost:3000/user"
    portfolio_display_url = f"{base_frontend_url}/{user_id}" 
    
    return {"portfolio_url": portfolio_display_url}