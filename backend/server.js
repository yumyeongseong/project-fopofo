const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');

dotenv.config();
connectDB();

const app = express();

// 세션 설정
app.use(session({
  secret: process.env.SESSION_SECRET || 'my-secret', // 환경변수 사용 권장
  resave: false,
  saveUninitialized: true,
}));

// Passport 설정
const passport = require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

// CORS 설정 - 환경변수 사용
app.use(cors({
  origin: process.env.CLIENT_URL, // 예: https://main.d2oba511izbg7k.amplifyapp.com
  credentials: true,
}));

// JSON 요청 파싱
app.use(express.json());

// 테스트용 API 라우트
app.get('/api/test', (req, res) => {
  res.json({ message: '백엔드가 제대로 작동 중입니다!' });
});

// 실제 API 라우트 등록
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const userUploadRoutes = require('./routes/userUploadRoutes');
const googleAuthRoutes = require('./routes/googleAuthRoutes');
const publicRoutes = require('./routes/publicRoutes');

app.use('/api/users', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', googleAuthRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/upload', uploadRoutes);
app.use('/api/user-upload', userUploadRoutes);
app.use('/api/public', publicRoutes);


// 서버 실행
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});