# rag_chatbot.py

import os
from dotenv import load_dotenv
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

def get_chatbot_response(query: str, user_id: str) -> str:
    # --- 1. 먼저 MongoDB에서 저장된 Q&A 답변을 찾아봅니다. ---
    qa_pairs = get_user_qa_pairs(user_id)
    if qa_pairs:
        questions = [qa['question'] for qa in qa_pairs]
        
        # 사용자의 질문과 저장된 질문들의 유사도를 계산합니다.
        query_embedding = np.array(embedding_model.embed_query(query)).reshape(1, -1)
        question_embeddings = np.array(embedding_model.embed_documents(questions))
        
        similarities = cosine_similarity(query_embedding, question_embeddings)[0]
        
        best_match_index = np.argmax(similarities)
        best_match_score = similarities[best_match_index]

        # ✅ 만약 유사도가 0.9 이상으로 매우 높으면, 저장된 답변을 사용합니다.
        if best_match_score > 0.9:
            print(f"--- MongoDB 답변 사용 (유사도: {best_match_score:.2f}) ---")
            return qa_pairs[best_match_index]['answer']

    # --- 2. MongoDB에서 적절한 답변을 찾지 못하면, Pinecone에서 문서를 검색합니다. ---
    print(f"--- Pinecone 문서 검색 실행 ---")
    pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
    index_name = os.getenv("PINECONE_INDEX")

    vectorstore = PineconeVectorStore.from_existing_index(
        index_name=index_name,
        embedding=embedding_model, # ✅ 재사용한 모델 사용
        namespace=user_id
    )
    
    # ✅ 더 나은 답변 품질을 위한 프롬프트 템플릿
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
        llm=llm, # ✅ 재사용한 모델 사용
        chain_type="stuff",
        retriever=vectorstore.as_retriever(),
        chain_type_kwargs=chain_type_kwargs
    )
    
    result = qa_chain.invoke({"query": query})
    return result.get("result", "답변을 생성하지 못했습니다.")