import axios from 'axios';

// 👇 1. Node.js 서버와 통신하는 axios 인스턴스 (주로 인증, 일반 파일 처리)
export const nodeApi = axios.create({
  baseURL: 'http://localhost:5000/api', // Node.js 서버 기본 URL
});

// 👇 2. Python(FastAPI) 서버와 통신하는 axios 인스턴스 (주로 AI 챗봇 기능)
export const pythonApi = axios.create({
  baseURL: 'http://localhost:8000', // Python 서버 기본 URL
});

// 👇 3. 요청을 보내기 전 토큰을 헤더에 담아주는 공통 함수
const addAuthToken = (config) => {
  const token = localStorage.getItem('token'); // 로컬 스토리지에서 토큰 가져오기
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // 헤더에 'Bearer 토큰' 추가
  }
  return config;
};

// 👇 4. 두 인스턴스 모두에 요청 인터셉터 적용
nodeApi.interceptors.request.use(addAuthToken, (error) => Promise.reject(error));
pythonApi.interceptors.request.use(addAuthToken, (error) => Promise.reject(error));

// ❌ 기존에 default로 내보내던 api는 더 이상 사용하지 않으므로 삭제합니다.
// export default api;

// nodeApi가 요청을 보내기 전에 가로채서 작업을 수행하는 인터셉터 설정
nodeApi.interceptors.request.use(
  (config) => {
    // localStorage에서 토큰을 가져옵니다.
    const token = localStorage.getItem('token');
    
    // 토큰이 존재하면, 모든 요청 헤더에 Authorization 값을 추가합니다.
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default nodeApi;