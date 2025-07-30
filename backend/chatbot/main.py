# main.py

from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Optional
import os

# --- 로컬 모듈 임포트 ---
from .user_answers import save_user_answers, get_user_answers
from .llm import store_document_vectors
from .rag_chatbot import get_chatbot_response
# optional 인증 함수를 함께 가져옵니다.
from .auth import get_current_user, get_current_user_optional 
from .chatbot_manager import router as chatbot_router
from .utils_function import get_predefined_questions


# --- Pydantic 모델 정의 ---
class AnswersRequest(BaseModel):
    answers: Dict[str, str]

class ChatRequest(BaseModel):
    query: str
    userId: Optional[str] = None # 공개/비공개 요청 모두 처리하기 위한 모델


# --- FastAPI 앱 설정 ---
app = FastAPI()

# --- CORS 미들웨어 설정 ---
# 두 브랜치의 허용 URL을 모두 추가하여 개발 및 배포 환경을 모두 지원합니다.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", # 로컬 개발용
        "https://main.d2oba511izbg7k.amplifyapp.com", # Amplify 프론트엔드
        "https://fopofo-chabot.onrender.com" # Render 백엔드
    ], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# chatbot_manager.py에 정의된 라우터를 포함합니다.
app.include_router(chatbot_router)


# --- API 엔드포인트 ---
@app.get("/")
async def read_root():
    return {"message": "안녕하세요! 챗봇 API 서버입니다."}


@app.post("/upload")
async def upload(file: UploadFile = File(...), user_id: str = Depends(get_current_user)):
    # 'user_files' 폴더가 없으면 생성
    os.makedirs('user_files', exist_ok=True)
    
    file_path = f"user_files/{user_id}_{file.filename}"
    try:
        with open(file_path, "wb") as f:
            f.write(await file.read())
        
        store_document_vectors(file_path, user_id)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"'{file.filename}' 처리 중 오류 발생: {str(e)}")
    
    finally:
        # 파일 처리 후 임시 파일 삭제
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


# ✅ [신규] 특정 사용자의 답변 목록을 조회하는 API (공개 포트폴리오용)
@app.get("/get-answers/{user_id}")
async def get_answers_api(user_id: str):
    """URL 경로에서 받은 user_id를 기반으로 저장된 답변을 조회합니다."""
    answers = get_user_answers(user_id)
    return {"user_id": user_id, "answers": answers}


# 유연한 인증을 사용하는 /chat API 채택
@app.post("/chat")
async def chat(request: ChatRequest, logged_in_user_id: Optional[str] = Depends(get_current_user_optional)):
    """
    공개/비공개 챗봇 요청을 모두 처리합니다.
    - 요청 본문에 userId가 있으면 해당 사용자의 챗봇으로 간주합니다 (공개 페이지용).
    - 요청 본문에 userId가 없고, 사용자가 로그인 상태이면 로그인된 사용자의 챗봇으로 간주합니다 (마이페이지용).
    """
    target_user_id = None
    if request.userId:
        target_user_id = request.userId
    elif logged_in_user_id:
        target_user_id = logged_in_user_id
    
    if not target_user_id:
        raise HTTPException(status_code=401, detail="답변 대상 사용자를 특정할 수 없습니다.")
    
    response = get_chatbot_response(request.query, target_user_id)
    return {"response": response}


# ✅ [신규] 공유용 포트폴리오 URL을 생성하는 API
@app.post("/generate-portfolio-url")
async def generate_portfolio_url(user_id: str = Depends(get_current_user)):
    """현재 로그인된 사용자의 ID를 기반으로 공유용 URL을 생성하여 반환합니다."""
    # 하드코딩된 localhost 대신 실제 배포된 프론트엔드 주소를 사용하도록 수정
    base_frontend_url = "https://main.d2oba511izbg7k.amplifyapp.com/user"
    portfolio_display_url = f"{base_frontend_url}/{user_id}"
    return {"portfolio_url": portfolio_display_url}