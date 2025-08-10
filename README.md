# 🤖 FOPOFO: AI 기반 자동 포트폴리오 및 챗봇 생성 서비스

[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/) [![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/) [![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)

> 본 서비스는 사용자가 자신의 다양한 파일(문서, 이미지, 동영상 등)을 업로드하면, AI가 이 중 자기소개서 및 이력서와 같은 문서들을 분석하여 개인화된 웹 포트폴리오와 대화형 챗봇을 자동 생성하는 플랫폼입니다. 생성된 포트폴리오와 챗봇은 고유 URL 및 QR 코드로 공유 가능합니다

<br>

## **📜 프로젝트 정보**

-   **프로젝트 기간:** 2025.07.09 ~ 2025.08.06
-   **참여 인원:** 3명
-   **🔗 배포 링크:** [https://staging.d1dbfs3o76ym6j.amplifyapp.com/](https://staging.d1dbfs3o76ym6j.amplifyapp.com/)

## **✨ 주요 기능**

-   **🤖 AI 챗봇 자동 생성:** 이력서, 자기소개서 등 개인 문서를 업로드하면, 해당 내용을 기반으로 답변하는 맞춤형 AI 챗봇이 생성됩니다.
-   **🌐 동적 웹 포트폴리오:** 업로드한 문서와 파일(이미지, 비디오, PDF)을 바탕으로 즉시 공유 가능한 개인 웹 포트폴리오 페이지를 구축합니다.
-   **🎨 테마 커스터마이징:** 생성된 포트폴리오 페이지의 폰트, 배경, 색상 등을 자유롭게 변경하여 자신만의 개성을 표현할 수 있습니다.
-   **🚀 간편한 파일 관리:** 직관적인 UI를 통해 자신의 포트폴리오를 구성하고, 마이페이지를 통해 모든 파일(이미지, 비디오, 문서 등)을 쉽게 추가/수정/삭제하고 관리할 수 있습니다.
## **🛠️ 기술 스택**

### **Frontend**
-   **`React.js`**, **`Tailwind CSS`**, **`Axios`**
-   **배포:** `AWS Amplify`

### **Backend (Node.js - API & User Service)**
-   **`Node.js`**, **`Express.js`**, **`MongoDB`**, **`JWT`**
-   **역할:** 사용자 인증, 파일 업로드(S3 연동), 포트폴리오 데이터 관리
-   **배포:** `AWS Elastic Beanstalk`

### **Backend (Python - AI Service)**
-   **`Python`**, **`FastAPI`**, **`LangChain`**, **`Pinecone`**, **`OpenAI`**
-   **역할:** RAG(검색 증강 생성) 기반 AI 챗봇 기능, 문서 임베딩 및 벡터 검색
-   **배포:** `Render`

## **🏛️ 시스템 아키텍처**
1.  **사용자 요청:** React 기반의 프론트엔드가 모든 사용자 요청을 받습니다.
2.  **API 서버 (Node.js):** 일반적인 요청(로그인, 파일 업로드 등)은 AWS Elastic Beanstalk에 배포된 Node.js 서버가 처리합니다. 파일은 S3에, 메타데이터는 MongoDB에 저장됩니다.
3.  **AI 서버 (Python):** 챗봇 관련 요청은 Render에 배포된 Python 서버로 전달됩니다. 이 서버는 LangChain을 통해 Pinecone 벡터 DB에서 관련 정보를 검색하고, OpenAI LLM을 통해 답변을 생성하여 반환합니다.

<br>