const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes'); // 추가!

dotenv.config();
connectDB();

const app = express();

app.use(cors({
    origin: 'http://localhost:3000', // 프론트엔드 주소
    credentials: true,
}));
app.use(express.json());
app.use(session({
    secret: 'my-secret',
    resave: false,
    saveUninitialized: true,
}));

app.use('/api/users', authRoutes);
app.use('/api/users', userRoutes);  

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});