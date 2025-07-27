const express = require('express');
const passport = require('passport');
const { generateToken } = require('../utils/jwt'); // ✅ 직접 generateToken을 사용하도록 변경
require('dotenv').config();

const router = express.Router();

// 구글 로그인 시작
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

// 구글 로그인 콜백
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: process.env.FRONTEND_URL + '/login',
    session: false,
  }),
  (req, res) => {
    if (req.user) {
      // ✅ --- 여기가 핵심 수정 부분입니다 --- ✅
      // 1. 일반 로그인과 동일한 형식으로 토큰에 담을 정보를 구성합니다.
      const tokenPayload = {
        userId: req.user.userId, 
        _id: req.user._id.toString() 
      };

      // 2. 이 정보를 바탕으로 토큰을 생성합니다.
      const token = generateToken(tokenPayload);

      res.redirect(process.env.FRONTEND_URL + `/login?token=${token}`);
    } else {
      res.redirect(process.env.FRONTEND_URL + '/login');
    }
  }
);

// 로그아웃
router.get('/logout', (req, res) => {
  res.status(200).json({ message: '로그아웃 성공! (클라이언트에서 토큰 삭제 필요)' });
});

module.exports = router;