# rag_chatbot.py

import os
from dotenv import load_dotenv
import unicodedata
import re
from utils import get_predefined_questions
from langchain_pinecone import PineconeVectorStore
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from pinecone import Pinecone
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from user_answers import get_user_qa_pairs # ✅ MongoDB 답변 조회를 위해 import

# ✅ 유사도 계산을 위해 추가
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

load_dotenv()

# ✅ OpenAI 임베딩 모델은 한 번만 초기화하여 재사용합니다.
embedding_model = OpenAIEmbeddings(
    model="text-embedding-3-large",
    openai_api_key=os.getenv("OPENAI_API_KEY")
)

# ✅ LangChain 모델도 한 번만 초기화하여 재사용합니다.
llm = ChatOpenAI(model_name="gpt-4", temperature=0, openai_api_key=os.getenv("OPENAI_API_KEY"))

def clean_string(text: str) -> str:
    if not isinstance(text, str):
        return ""
    normalized_text = unicodedata.normalize('NFC', text)
    return re.sub(r'\s+', '', normalized_text)

def get_chatbot_response(query: str, user_id: str) -> str:
    # --- 1. MongoDB에서 답변을 찾기 전, 받은 질문(query)을 변환합니다. ---
    
    predefined_questions = get_predefined_questions()
    query_to_find = query 

    for q_map in predefined_questions:
        if q_map["full_text"] == query:
            query_to_find = q_map["short_text"]
            break
    
    qa_pairs = get_user_qa_pairs(user_id)
    if qa_pairs:
        for pair in qa_pairs:
            if pair.get("question") == query_to_find:
                print(f"--- MongoDB 답변 사용 ('{query_to_find}' 와 정확히 일치) ---")
                return pair.get("answer", "저장된 답변을 찾았으나 내용이 없습니다.")

    # --- 2. MongoDB에서 정확히 일치하는 답변을 찾지 못하면, Pinecone에서 문서를 검색합니다. ---
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
    PROMPT = PromptTemplate(
        template=prompt_template, input_variables=["context", "question"]
    )
    
    chain_type_kwargs = {"prompt": PROMPT}
    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=vectorstore.as_retriever(),
        chain_type_kwargs=chain_type_kwargs
    )
    
    result = qa_chain.invoke({"query": query})
    return result.get("result", "답변을 생성하지 못했습니다.")