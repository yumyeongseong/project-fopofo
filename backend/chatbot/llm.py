import os
from dotenv import load_dotenv
from langchain_pinecone import PineconeVectorStore
from langchain_openai import OpenAIEmbeddings
from pinecone import Pinecone, ServerlessSpec
from langchain_community.document_loaders import PyPDFLoader, Docx2txtLoader, TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

load_dotenv()

embedding = OpenAIEmbeddings(
    model="text-embedding-3-large",
    openai_api_key=os.getenv("OPENAI_API_KEY")
)

def store_document_vectors(file_path: str, user_id: str):
    if file_path.endswith(".pdf"):
        documents = PyPDFLoader(file_path).load()
    elif file_path.endswith(".docx"):
        documents = Docx2txtLoader(file_path).load()
    elif file_path.endswith(".txt"):
        documents = TextLoader(file_path).load()
    else:
        raise ValueError("지원하지 않는 파일 형식입니다.")

    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    texts = splitter.split_documents(documents)

    pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
    index_name = os.getenv("PINECONE_INDEX", "chatbot-index")

    if index_name not in pc.list_indexes().names():
        pc.create_index(
            name=index_name,
            dimension=3072,
            metric="cosine",
            spec=ServerlessSpec(cloud="aws", region="us-east-1")  # 필요에 따라 region 수정
        )

    PineconeVectorStore.from_documents(
        documents=texts,
        embedding=embedding,
        index_name=index_name,
        namespace=user_id
    )