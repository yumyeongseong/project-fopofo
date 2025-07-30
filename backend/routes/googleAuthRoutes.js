// routes/googleAuthRoutes.js

const express = require('express');
const passport = require('passport');
const { generateToken } = require('../utils/jwt');
require('dotenv').config();

const router = express.Router();

// 구글 로그인 시작
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

// 구글 로그인 콜백
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: process.env.FRONTEND_URL + '/login', // ✅ 환경변수 사용
    session: false, // JWT를 사용하므로 세션 비활성화
  }),
  (req, res) => {
    if (req.user) {
      // ✅ 일반 로그인과 동일한 형식으로 토큰 payload 구성
      const tokenPayload = {
        userId: req.user.userId,
        _id: req.user._id.toString()
      };

      // ✅ 일관된 토큰 생성
      const token = generateToken(tokenPayload);

      // ✅ 토큰을 쿼리 파라미터로 프론트엔드에 전달
      res.redirect(`${process.env.FRONTEND_URL}/login?token=${token}`);
    } else {
      res.redirect(process.env.FRONTEND_URL + '/login');
    }
  }
);

// 로그아웃 (클라이언트에서 토큰을 삭제하므로 서버에서는 특별한 처리가 필요 없음)
router.get('/logout', (req, res) => {
  res.status(200).json({ message: '로그아웃 성공! (클라이언트에서 토큰 삭제 필요)' });
});

module.exports = router;