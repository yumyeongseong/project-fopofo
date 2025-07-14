const express = require('express');
const passport = require('passport');

const router = express.Router();

// 구글 로그인 시작
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

// 구글 로그인 콜백
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login/failed',
    session: true,
  }),
  (req, res) => {
    res.redirect('http://localhost:3000/mypage'); // 프론트엔드 구현이 주소바꾸기(구글 로그인 성공 후 보여지는 페이지)
  }
);


router.get('/logout', (req, res) => {
  req.logout(() => {
    // 세션 삭제 및 쿠키 제거
    req.session.destroy();
    res.clearCookie('connect.sid'); // 세션 쿠키 삭제
    res.status(200).json({ message: '로그아웃 성공! 세션 제거됨' });
  });
});

module.exports = router;

