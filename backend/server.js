const express = require('express');
const dotenv = require('dotenv');
// const session = require('express-session');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path'); // <-- path 모듈 추가

dotenv.config();
connectDB();

const app = express();

// app.use(session({
//   secret: 'my-secret',
//   resave: false,
//   saveUninitialized: true,
// }));

// app.use(passport.session());
const passport = require('./config/passport');
app.use(passport.initialize());

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());

// ✅ 라우트 설정
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const userUploadRoutes = require('./routes/userUploadRoutes');
const googleAuthRoutes = require('./routes/googleAuthRoutes');
const publicRoutes = require('./routes/publicRoutes');

app.use('/api/public', publicRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/auth', googleAuthRoutes);

app.use('/api/users', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/user-upload', userUploadRoutes);

// --- React 프론트엔드 파일 서빙을 위한 코드 수정 시작 ---
// Production 환경에서만 React 빌드 파일을 서빙하도록 설정
if (process.env.NODE_ENV === 'production') { // ✅ 이 줄로 다시 변경합니다.
// if (true) { // ✅ 이 줄로 다시 변경합니다.
  const buildPath = path.resolve(__dirname, 'build');

  console.log(`Serving static files from: ${buildPath}`);

  app.use(express.static(buildPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}
// --- React 프론트엔드 파일 서빙을 위한 코드 수정 끝 ---
// ... (나머지 코드 유지) ...

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
}); 