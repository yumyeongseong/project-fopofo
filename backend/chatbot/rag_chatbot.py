# rag_chatbot.py

import os
import re
import unicodedata
from dotenv import load_dotenv

# --- 외부 라이브러리 임포트 ---
from langchain_pinecone import PineconeVectorStore
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from pinecone import Pinecone
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# --- 로컬 파일에서 함수 임포트 ---
from .utils_function import get_predefined_questions
from .user_answers import get_user_qa_pairs

load_dotenv()

# --- 모델 및 클라이언트 전역 초기화 (재사용) ---
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
    """문자열을 NFC로 정규화하고 공백을 제거합니다."""
    if not isinstance(text, str):
        return ""
    normalized_text = unicodedata.normalize('NFC', text)
    return re.sub(r'\s+', '', normalized_text)

def get_chatbot_response(query: str, user_id: str) -> str:
    """챗봇의 답변을 생성하는 메인 함수"""
    
    # --- 1. MongoDB에서 유사도 기반으로 답변 검색 ---
    qa_pairs = get_user_qa_pairs(user_id)
    if qa_pairs:
        # 저장된 질문들만 리스트로 추출
        questions = [pair.get("question", "") for pair in qa_pairs]
        
        try:
            # 현재 질문과 저장된 모든 질문의 임베딩 벡터 계산
            query_embedding = np.array(embedding_model.embed_query(query)).reshape(1, -1)
            question_embeddings = np.array(embedding_model.embed_documents(questions))
            
            # 코사인 유사도 계산
            similarities = cosine_similarity(query_embedding, question_embeddings)[0]
            best_match_index = np.argmax(similarities)
            best_score = similarities[best_match_index]
            
            # 유사도가 0.9 이상이면 저장된 답변 사용 (임계값은 조정 가능)
            if best_score > 0.9:
                print(f"--- MongoDB 답변 사용 (유사도 {best_score:.2f}) ---")
                return qa_pairs[best_match_index].get("answer", "저장된 답변을 찾았으나 내용이 없습니다.")
                
        except Exception as e:
            print(f"답변 유사도 비교 중 오류 발생: {e}")

    # --- 2. MongoDB에서 답변을 찾지 못하면, Pinecone RAG로 검색 ---
    print(f"--- Pinecone 문서 검색 실행 (사용자: {user_id}) ---")
    pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
    index_name = os.getenv("PINECONE_INDEX")

    vectorstore = PineconeVectorStore.from_existing_index(
        index_name=index_name,
        embedding=embedding_model,
        namespace=user_id
    )
    
    # 상세한 역할과 지침을 담은 프롬프트 사용
    prompt_template = """
    당신은 사용자가 업로드한 이력서, 자기소개서, 포트폴리오 등 자료와 입력된 프롬프트 내용을 기반으로,
    실제 면접 상황에서 구직자(지원자)의 역할을 대신 수행하는 AI 챗봇입니다.

    당신은 현재 기업의 채용담당자 또는 면접관과 대화하고 있으며,
    사용자의 제출 자료와 질문 프롬프트를 바탕으로 자신을 어필하는 입장에서 자연스럽고 설득력 있는 태도로 답변해야 합니다.

    대답은 구체적이고 전문적이어야 하며, 친절하고 진정성 있는 말투를 사용해주세요.  

    만약 주어진 자료에 답변할 수 있는 충분한 정보가 없다면, 
    “제출된 자료를 통해서는 해당 질문에 충분히 답변드리기 어렵습니다.”라고 정중히 답해주세요.

    컨텍스트:
    {context}

    질문:
    {question}

    답변:
    """
    PROMPT = PromptTemplate(
        template=prompt_template, input_variables=["context", "question"]
    )
    
    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=vectorstore.as_retriever(),
        chain_type_kwargs={"prompt": PROMPT}
    )
    
    result = qa_chain.invoke({"query": query})
    return result.get("result", "답변을 생성하지 못했습니다.")