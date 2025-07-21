import os
from typing import Optional
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from pymongo import MongoClient
from dotenv import load_dotenv
from pinecone import Pinecone
from auth import get_current_user
from user_answers import delete_user_answers, save_user_answers, get_user_answers

# .env 로드
load_dotenv()

# MongoDB 설정
client = MongoClient(os.getenv("MONGO_URI"))
db = client["chatbot_db"]
chatbots_collection = db["chatbot_metadata"]

# Pinecone 설정
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
INDEX_NAME = os.getenv("PINECONE_INDEX", "chatbot-index")
pc = Pinecone(api_key=PINECONE_API_KEY)

# FastAPI 라우터
router = APIRouter()


# --- 모델 ---
class ChatbotMetadata(BaseModel):
    chatbot_id: str
    user_id: str
    created_at: Optional[str] = None


# --- 챗봇 등록 ---
@router.post("/register-chatbot")
def register_chatbot(metadata: ChatbotMetadata, user_id: str = Depends(get_current_user)):
    chatbots_collection.replace_one(
        {'user_id': user_id}, 
        metadata.dict(), 
        upsert=True
    )
    return {"message": "챗봇이 성공적으로 등록되었습니다.", "chatbot": metadata}


# --- 챗봇 조회 ---
@router.get("/my-chatbot")
def get_my_chatbot(user_id: str = Depends(get_current_user)):
    chatbot_data = chatbots_collection.find_one({"user_id": user_id})
    if not chatbot_data:
        raise HTTPException(status_code=404, detail="등록된 챗봇이 존재하지 않습니다.")
    chatbot_data["_id"] = str(chatbot_data["_id"])  # ObjectId 문자열 변환
    return chatbot_data


# --- 질문 답변 목록 조회 ---
@router.get("/get-answers")
async def get_answers_api(user_id: str = Depends(get_current_user)):
    questions = get_user_answers(user_id)
    return questions if questions else []


# --- 챗봇 전체 삭제 (MongoDB + Pinecone + 답변) ---
@router.delete("/delete-chatbot")
def delete_chatbot(user_id: str = Depends(get_current_user)):
    # 1. 챗봇 메타데이터 삭제
    delete_result = chatbots_collection.delete_one({"user_id": user_id})
    if delete_result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="삭제할 챗봇이 없습니다.")

    # 2. Pinecone 벡터 삭제
    try:
        if INDEX_NAME in pc.list_indexes().names():
            index = pc.Index(INDEX_NAME)
            index.delete(delete_all=True, namespace=user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pinecone 데이터 삭제 중 오류 발생: {e}")

    # 3. 질문/답변 삭제
    delete_user_answers(user_id)

    return {"message": "챗봇이 성공적으로 삭제되었습니다."}


# --- Pinecone 벡터만 삭제 ---
@router.delete("/pinecone-vectors")
def delete_pinecone_vectors(user_id: str = Depends(get_current_user)):
    try:
        if INDEX_NAME in pc.list_indexes().names():
            index = pc.Index(INDEX_NAME)
            index.delete(delete_all=True, namespace=user_id)
            return {"message": f"{user_id}의 벡터가 삭제되었습니다."}
        else:
            return {"message": "삭제할 Pinecone 인덱스가 없습니다."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pinecone 데이터 삭제 중 오류 발생: {e}")
