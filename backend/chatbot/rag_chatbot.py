# rag_chatbot.py

import os
import re
import unicodedata
from dotenv import load_dotenv

from langchain_pinecone import PineconeVectorStore
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from pinecone import Pinecone

from .user_answers import get_user_qa_pairs
from utils import get_predefined_questions

from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

load_dotenv()

# ✅ 모델은 재사용 가능하도록 전역으로 초기화
embedding_model = OpenAIEmbeddings(
    model="text-embedding-3-large",
    openai_api_key=os.getenv("OPENAI_API_KEY")
)

llm = ChatOpenAI(
    model_name="gpt-4",
    temperature=0,
    openai_api_key=os.getenv("OPENAI_API_KEY")
)

def clean_string(text: str) -> str:
    """문자열을 NFC로 정규화하고 공백 제거"""
    if not isinstance(text, str):
        return ""
    normalized = unicodedata.normalize('NFC', text)
    return re.sub(r'\s+', '', normalized)


def get_chatbot_response(query: str, user_id: str) -> str:
    # --- 1. 미리 등록된 질문과 매칭해 변환 ---
    predefined_questions = get_predefined_questions()
    query_to_find = query

    for q_map in predefined_questions:
        if isinstance(q_map, dict) and q_map.get("full_text") == query:
            query_to_find = q_map["short_text"]
            break

    # --- 2. MongoDB에서 답변 찾기 ---
    qa_pairs = get_user_qa_pairs(user_id)
    if qa_pairs:
        questions = [qa["question"] for qa in qa_pairs]

        try:
            query_embedding = np.array(embedding_model.embed_query(query)).reshape(1, -1)
            question_embeddings = np.array(embedding_model.embed_documents(questions))
            similarities = cosine_similarity(query_embedding, question_embeddings)[0]
            best_match_index = np.argmax(similarities)
            best_score = similarities[best_match_index]

            if best_score > 0.9:
                print(f"--- MongoDB 답변 사용 (유사도 {best_score:.2f}) ---")
                return qa_pairs[best_match_index]['answer']
        except Exception as e:
            print("유사도 비교 실패:", e)

        # 또는 정확히 일치하는 short_text 기반 검색
        for pair in qa_pairs:
            if pair.get("question") == query_to_find:
                print(f"--- MongoDB 답변 사용 ('{query_to_find}' 와 정확히 일치) ---")
                return pair.get("answer", "저장된 답변이 있지만 내용이 없습니다.")

    # --- 3. Pinecone로 문서 검색 ---
    print("--- Pinecone 문서 검색 실행 ---")
    pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
    index_name = os.getenv("PINECONE_INDEX")

    vectorstore = PineconeVectorStore.from_existing_index(
        index_name=index_name,
        embedding=embedding_model,
        namespace=user_id
    )

    prompt_template = """
    당신은 사용자의 포트폴리오를 기반으로 면접 채용 담당자에게 답해주는 챗봇입니다.
    주어진 컨텍스트 정보를 사용하여 다음 질문에 대해 상세하고 전문적인 톤으로 답변해주세요.
    만약 컨텍스트에 정보가 없다면, "제출된 자료를 통해서는 답변하기 어렵습니다."라고 솔직하게 말해주세요.

    컨텍스트:
    {context}

    질문:
    {question}

    답변:
    """
    PROMPT = PromptTemplate(template=prompt_template, input_variables=["context", "question"])

    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=vectorstore.as_retriever(),
        chain_type_kwargs={"prompt": PROMPT}
    )

    result = qa_chain.invoke({"query": query})
    return result.get("result", "답변을 생성하지 못했습니다.")
