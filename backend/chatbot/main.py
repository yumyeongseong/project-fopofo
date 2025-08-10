# main.py

from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Optional
import os

# --- 로컬 모듈 임포트 ---
# 상대 경로 임포트를 절대 경로 임포트로 변경
from user_answers import save_user_answers, get_user_answers
from llm import store_document_vectors
from rag_chatbot import get_chatbot_response
from auth import get_current_user, get_current_user_optional 
from chatbot_manager import router as chatbot_router
from utils_function import get_predefined_questions


# --- Pydantic 모델 정의 ---
class AnswersRequest(BaseModel):
    answers: Dict[str, str]

class ChatRequest(BaseModel):
    query: str
    userId: Optional[str] = None

# --- FastAPI 앱 설정 ---
app = FastAPI()

# --- CORS 미들웨어 설정 ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://main.d2oba511izbg7k.amplifyapp.com",
        "https://fopofo-chabot.onrender.com"
    ], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chatbot_router)


# --- API 엔드포인트 ---
@app.get("/")
async def read_root():
    return {"message": "안녕하세요! 챗봇 API 서버입니다."}


@app.post("/upload")
async def upload(file: UploadFile = File(...), user_id: str = Depends(get_current_user)):
    os.makedirs('user_files', exist_ok=True)
    
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


@app.post("/save-answers")
async def save_answers_api(request: AnswersRequest, user_id: str = Depends(get_current_user)):
    received_data = request.answers
    predefined_questions = get_predefined_questions()
    answers_list_to_save = []
    for i, q_map in enumerate(predefined_questions):
        question_key = f"question_{i + 1}"
        answer_key = f"answer_{i + 1}"
        if question_key in received_data and answer_key in received_data:
            answers_list_to_save.append({
                "question": q_map["short_text"], 
                "answer": received_data[answer_key]
            })
    save_user_answers(user_id, answers_list_to_save)
    return {"message": "질문 답변 저장 완료"}


@app.get("/get-answers/{user_id}")
async def get_answers_api(user_id: str):
    answers = get_user_answers(user_id)
    return {"user_id": user_id, "answers": answers}


@app.post("/chat")
async def chat(request: ChatRequest, logged_in_user_id: Optional[str] = Depends(get_current_user_optional)):
    target_user_id = None
    if request.userId:
        target_user_id = request.userId
    elif logged_in_user_id:
        target_user_id = logged_in_user_id
    
    if not target_user_id:
        raise HTTPException(status_code=401, detail="답변 대상 사용자를 특정할 수 없습니다.")
    
    response = get_chatbot_response(request.query, target_user_id)
    return {"response": response}


@app.post("/generate-portfolio-url")
async def generate_portfolio_url(user_id: str = Depends(get_current_user)):
    base_frontend_url = "https://main.d2oba511izbg7k.amplifyapp.com/user"
    portfolio_display_url = f"{base_frontend_url}/{user_id}"
    return {"portfolio_url": portfolio_display_url}