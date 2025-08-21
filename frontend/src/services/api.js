import axios from 'axios';

// --- 환경 변수에서 기본 URL 가져오기 ---
// 이 변수들은 배포 시 .env.production 파일의 값으로 대체됩니다.
const NODE_BASE_URL = process.env.REACT_APP_NODE_API_URL;
const PYTHON_BASE_URL = process.env.REACT_APP_PYTHON_API_URL;

// --- API 종류별 axios 인스턴스 생성 ---

// 1. 인증 토큰이 필요한 Node.js API용
export const nodeApi = axios.create({
  baseURL: NODE_BASE_URL,
});

// 2. 인증 토큰이 필요한 Python API용
export const pythonApi = axios.create({
  baseURL: PYTHON_BASE_URL,
});

// 3. 인증 토큰이 필요 없는 공개용 API용 (공유 페이지에서 사용)
export const publicApi = axios.create({
  baseURL: NODE_BASE_URL,
});


// --- 요청 전에 토큰을 헤더에 담아주는 공통 로직 ---
const addAuthToken = (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

// --- 토큰이 필요한 API에만 인터셉터 적용 ---
nodeApi.interceptors.request.use(addAuthToken);
pythonApi.interceptors.request.use(addAuthToken);

// publicApi 에는 인터셉터를 적용하지 않으므로, 토큰 없이 요청을 보냅니다.

