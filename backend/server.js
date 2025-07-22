// 📦 기본 의존성 모듈 불러오기
const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

// 🔗 DB 연결 함수
const connectDB = require('./config/db');

// 🌐 환경 변수 로딩
dotenv.config();

// 🔌 DB 연결 실행
connectDB();

const app = express();

// 🌍 CORS 설정 (로컬 + Amplify 프론트 허용)
const allowedOrigins = [
  'http://localhost:3000',
  'https://main.d2oba511izbg7k.amplifyapp.com',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// 📦 요청 바디 파싱
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📂 정적 파일 (업로드된 파일) 제공
app.use('/uploads', express.static('uploads'));

// 🚏 라우터 불러오기 (중복 없이!)
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const userUploadRoutes = require('./routes/userUploadRoutes');
const googleAuthRoutes = require('./routes/googleAuthRoutes');
const publicRoutes = require('./routes/publicRoutes');

// 🚦 라우터 등록
app.use('/api/public', publicRoutes);              // 공개용 API
app.use('/api/auth', googleAuthRoutes);            // 구글 로그인
app.use('/api/users', authRoutes);                 // 회원가입/로그인 관련
app.use('/api/users', userRoutes);                 // 사용자 데이터 처리
app.use('/api/upload', uploadRoutes);              // 일반 업로드
app.use('/api/user-upload', userUploadRoutes);     // 유저별 업로드

// 🧪 디버깅 로그
console.log('✅ 현재 CLIENT_URL:', process.env.CLIENT_URL);

// 🧱 프로덕션용 정적 파일 제공 (선택 사항)
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, 'frontend', 'build')));
//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
//   });
// }

// 🚀 서버 실행
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
