# 📦 프로젝트 디렉토리 구조

## Backend
- `controllers/`: 비즈니스 로직 라우팅 및 처리 단위
  - `routes/`: 기능별 라우터 분리
    - `auth/`: 로그인, 회원가입 API
    - `chatbot/`: 챗봇 생성 관련 API
    - `file/`: 포트폴리오 파일 업로드 API
    - `mypage/`: 사용자 결과물 조회 API
  - `middlewares/`: 공통 요청 처리 (예: 인증, 에러 핸들링)
  - `models/`: 데이터 구조 정의 (예: Pydantic or Schema)
- `services/`: 외부 API 연동, 비즈니스 로직
- `uploads/`: 사용자 업로드 저장소
  - `docs/`, `images/`, `videos/`

## Frontend
- `src/pages/`: 페이지별 구성 (UploadPage, TemplatePage 등)
- `src/components/`: 공통 UI 구성 요소
- `src/contexts/`: 전역 상태 관리 (예: AuthContext 등)
- `src/services/`: API 호출 함수 (예: uploadService.js)
- `App.js`: React Router 경로 설정
