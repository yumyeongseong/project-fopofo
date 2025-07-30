// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const { signup, login, logout, getMyPage } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// --- 인증이 필요 없는 라우트 ---
router.post('/signup', signup);
router.post('/login', login);

// --- 인증이 필요한 라우트 ---
// GET /api/auth/logout
router.get('/logout', authMiddleware, logout);
// GET /api/auth/me
router.get('/me', authMiddleware, getMyPage);


module.exports = router;