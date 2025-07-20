from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from user_answers import save_user_answers, get_user_answers
from llm import store_document_vectors
from rag_chatbot import get_chatbot_response
from auth import get_current_user
from typing import Dict
from pydantic import BaseModel
from utils import get_predefined_questions
from fastapi.middleware.cors import CORSMiddleware
from chatbot_manager import router as chatbot_router
import os
import json

class AnswersRequest(BaseModel):
    answers: Dict[str, str]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # ✅ 수정된 부분: 프런트엔드 주소로 변경 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chatbot_router)

@app.get("/")
async def read_root():
    return {"message": "안녕하세요! 챗봇 API 서버입니다."}


### 챗봇 문서 업로드
@app.post("/upload")
async def upload(file: UploadFile = File(...), user_id: str = Depends(get_current_user)):
    file_path = f"user_files/{user_id}_{file.filename}"
    try:
        with open(file_path, "wb") as f:
            f.write(await file.read())
        
        # ✅ 반복문 없이 바로 함수를 호출합니다.
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
    # ▼▼▼▼▼ 여기가 핵심 수정 부분입니다 ▼▼▼▼▼
    # 프론트에서 받은 데이터: { 'question_1': '전체질문1', 'answer_1': '답변1', ... }
    received_data = request.answers
    
    # utils.py에서 정의한 원본 질문 목록을 가져옵니다.
    predefined_questions = get_predefined_questions()
    
    answers_list_to_save = []
    for i, q_map in enumerate(predefined_questions):
        # 프론트에서 받은 데이터의 키를 조합합니다. (question_1, answer_1 등)
        question_key = f"question_{i + 1}"
        answer_key = f"answer_{i + 1}"

        # DB에 저장할 객체를 생성합니다.
        # 질문은 '축약형(short_text)'으로, 답변은 받은 그대로 저장합니다.
        if question_key in received_data and answer_key in received_data:
            answers_list_to_save.append({
                "question": q_map["short_text"], 
                "answer": received_data[answer_key]
            })

    # 최종적으로 변환된 리스트를 DB에 저장합니다.
    save_user_answers(user_id, answers_list_to_save)
    # ▲▲▲▲▲ 수정 완료 ▲▲▲▲▲
    
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

@app.post("/generate-portfolio-url")
async def generate_portfolio_url(user_id: str = Depends(get_current_user)):
    # user_id는 JWT에서 가져온 것이므로 이미 ASCII 안전한 값입니다.
    # 이전 단계에서 user_id를 SHA256 해싱해서 사용하기로 했으므로,
    # 여기서는 해싱된 user_id를 URL에 바로 사용할 수 있습니다.
    base_frontend_url = "http://localhost:3000/user" # UserPage를 렌더링할 기본 경로
    
    # user_id를 URL 경로에 포함하여 고유한 사용자 페이지를 나타냅니다.
    portfolio_display_url = f"{base_frontend_url}/{user_id}" 
    
    return {"portfolio_url": portfolio_display_url}