# chatbot_manager.py

import os
from typing import Optional

# --- 외부 라이브러리 임포트 ---
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from pinecone import Pinecone
from pymongo import MongoClient
from dotenv import load_dotenv

# --- 로컬 파일에서 함수 임포트 (상대 경로 명시) ---
from .auth import get_current_user
from .user_answers import delete_user_answers, save_user_answers, get_user_answers


# --- .env 파일 로드 ---
load_dotenv()

# --- MongoDB 클라이언트 설정 ---
client = MongoClient(os.getenv("MONGO_URI"))
db = client["chatbot_db"]
chatbots_collection = db["chatbot_metadata"]


# --- Pinecone 클라이언트 설정 ---
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
INDEX_NAME = os.getenv("PINECONE_INDEX", "chatbot-index")
pc = Pinecone(api_key=PINECONE_API_KEY)


# --- FastAPI 라우터 설정 ---
router = APIRouter()


# --- Pydantic 모델 ---
class ChatbotMetadata(BaseModel):
    chatbot_id: str
    user_id: str
    created_at: Optional[str] = None


# --- API 엔드포인트 ---

### 챗봇 등록 (등록해야지 챗봇 수정/삭제 가능)
@router.post("/register-chatbot")
def register_chatbot(metadata: ChatbotMetadata, user_id: str = Depends(get_current_user)):
    chatbots_collection.replace_one(
        {'user_id': user_id}, 
        metadata.dict(), 
        upsert=True
    )
    return {"message": "챗봇이 성공적으로 등록되었습니다.", "chatbot": metadata}


### 챗봇 조회
@router.get("/my-chatbot")
def get_my_chatbot(user_id: str = Depends(get_current_user)):
    chatbot_data = chatbots_collection.find_one({"user_id": user_id})
    
    if not chatbot_data:
        raise HTTPException(status_code=404, detail="등록된 챗봇이 존재하지 않습니다.")
    
    # MongoDB의 ObjectId를 문자열로 변환
    chatbot_data["_id"] = str(chatbot_data["_id"])
    return chatbot_data


### 사용자가 저장한 답변 목록 조회
@router.get("/get-answers")
async def get_answers_api(user_id: str = Depends(get_current_user)):
    """
    현재 로그인된 사용자의 저장된 질문 목록을 반환하는 API
    """
    questions = get_user_answers(user_id)
    # 질문이 없는 경우 빈 리스트를 반환
    return questions if questions else []


### 챗봇 전체 데이터 삭제 (Pinecone + MongoDB)
@router.delete("/delete-chatbot")
def delete_chatbot(user_id: str = Depends(get_current_user)):
    """현재 로그인된 사용자의 모든 관련 데이터(Pinecone 벡터, MongoDB 메타데이터, 답변)를 삭제합니다."""
    # 1. MongoDB에서 챗봇 메타데이터 삭제
    delete_result = chatbots_collection.delete_one({"user_id": user_id})
    
    if delete_result.deleted_count == 0:
         raise HTTPException(status_code=404, detail="삭제할 챗봇이 없습니다.")

    # 2. Pinecone에서 벡터 데이터 삭제
    try:
        if INDEX_NAME in pc.list_indexes().names():
            index = pc.Index(INDEX_NAME)
            index.delete(delete_all=True, namespace=user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pinecone 데이터 삭제 중 오류 발생: {e}")

    # 3. MongoDB에서 질문 답변 데이터 삭제
    delete_user_answers(user_id)

    return {"message": "챗봇의 모든 데이터가 성공적으로 삭제되었습니다."}


### Pinecone 벡터 데이터만 삭제
@router.delete("/pinecone-vectors")
def delete_pinecone_vectors(user_id: str = Depends(get_current_user)):
    """현재 로그인된 사용자의 Pinecone 벡터 데이터만 삭제합니다."""
    try:
        if INDEX_NAME in pc.list_indexes().names():
            index = pc.Index(INDEX_NAME)
            # delete_all=True와 namespace를 함께 사용하면 해당 네임스페이스의 모든 벡터가 삭제됩니다.
            index.delete(delete_all=True, namespace=user_id)
            return {"message": f"사용자 '{user_id}'의 Pinecone 문서 벡터가 성공적으로 삭제되었습니다."}
        else:
            return {"message": "삭제할 Pinecone 인덱스가 없습니다."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pinecone 데이터 삭제 중 오류 발생: {e}")