from pymongo import MongoClient
from datetime import datetime
from dotenv import load_dotenv
import os

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))
db = client["chatbot_db"]
answers_collection = db["user_answers"]

def save_user_answers(user_id: str, answers: dict):
    answers_collection.update_one(
        {"user_id": user_id},
        {"$set": {"answers": answers, "updated_at": datetime.utcnow()}},
        upsert=True
    )

def get_user_answers(user_id: str) -> dict:
    doc = answers_collection.find_one({"user_id": user_id})
    return doc["answers"] if doc and "answers" in doc else {}

def delete_user_answers(user_id: str):
    answers_collection.delete_one({"user_id": user_id})