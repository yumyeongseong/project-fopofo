import axios from 'axios';

// Node.js 서버와 통신하는 axios 인스턴스
export const nodeApi = axios.create({
  // ✅ [기능] 배포를 위해 환경변수에서 API 주소를 가져옵니다.
  baseURL: process.env.REACT_APP_NODE_API,
});

// Python(FastAPI) 서버와 통신하는 axios 인스턴스
export const pythonApi = axios.create({
  // ✅ [기능] 배포를 위해 환경변수에서 API 주소를 가져옵니다.
  baseURL: process.env.REACT_APP_PYTHON_API,
});

// 요청을 보내기 전 토큰을 헤더에 담아주는 공통 함수
const addAuthToken = (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

// ✅ [디자인] 두 인스턴스 모두에 깔끔한 방식으로 인터셉터를 적용합니다.
nodeApi.interceptors.request.use(addAuthToken);
pythonApi.interceptors.request.use(addAuthToken);