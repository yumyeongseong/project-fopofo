const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');

dotenv.config();
connectDB();

const app = express();

// ✅ 세션 먼저 설정
app.use(session({
  secret: 'my-secret', // 환경변수로 빼도 좋아
  resave: false,
  saveUninitialized: true,
}));



// ✅ passport 초기화 및 세션 연결
const passport = require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
  origin: 'http://localhost:3000', // 프론트엔드 주소
  credentials: true,
}));

app.use(express.json());

// ✅ 라우트 설정
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const userUploadRoutes = require('./routes/userUploadRoutes');


app.use('/api/users', authRoutes);
app.use('/api/users', userRoutes);
// app.use('/api/auth', googleAuthRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/upload', uploadRoutes);
app.use('/api/user-upload', userUploadRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});
