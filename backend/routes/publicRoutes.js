// routes/publicRoutes.js

const express = require('express');
const router = express.Router();
const { getPublicPortfolio, getPublicIntro } = require('../controllers/publicController');

// 👇 로그인 없이 접근 가능한 공개 라우트 정의
// GET /api/public/portfolio/{userId}
router.get('/portfolio/:userId', getPublicPortfolio);

// GET /api/public/intro/{userId}  (✅ 추가된 라우트)
router.get('/intro/:userId', getPublicIntro);

module.exports = router;