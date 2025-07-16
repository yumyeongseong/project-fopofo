const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');

dotenv.config();
connectDB();

const app = express();

app.use(session({
  secret: 'my-secret',
  resave: false,
  saveUninitialized: true,
}));

const passport = require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

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
const googleAuthRoutes = require('./routes/googleAuthRoutes'); // ✅ 수정된 부분: googleAuthRoutes 임포트 추가

app.use('/api/users', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', googleAuthRoutes); // ✅ 수정된 부분: googleAuthRoutes 사용 설정
app.use('/uploads', express.static('uploads'));
app.use('/api/upload', uploadRoutes);
app.use('/api/user-upload', userUploadRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});