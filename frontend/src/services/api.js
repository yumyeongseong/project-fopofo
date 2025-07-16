// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, // 세션 사용 시 필요. JWT만 쓰면 생략 가능.
});

// ✅ 요청 시 JWT 자동 첨부
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // 로그인 후 저장된 토큰
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
