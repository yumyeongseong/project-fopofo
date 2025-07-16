const express = require('express');
const passport = require('passport');
const jwtUtil = require('../utils/jwt'); // ✅ 수정된 부분: JWT 유틸리티 임포트 추가

const router = express.Router();

// 구글 로그인 시작
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

// 구글 로그인 콜백
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: 'http://localhost:3000/login', // ✅ 수정된 부분: 로그인 실패 시 프런트엔드 경로로 리다이렉트
    session: false, // ✅ 수정된 부분: 세션 사용 안 함 (JWT 기반으로 변경)
  }),
  (req, res) => {
    // ⭐️ Google 로그인 성공 후 JWT 생성 및 전달 로직 추가 ⭐️
    if (req.user) { // passport.done(null, user) 로 전달된 사용자 정보
      const token = jwtUtil.generateToken({ id: req.user.id }); // ✅ 수정된 부분: JWT 생성

      // ✅ 수정된 부분: JWT를 쿼리 파라미터로 포함하여 프런트엔드로 리다이렉트
      // 프런트엔드는 이 URL에서 토큰을 추출하게 됩니다.
      res.redirect(`http://localhost:3000/home?token=${token}`);
    } else {
      // ✅ 수정된 부분: 사용자 정보가 없으면 실패 처리
      res.redirect('http://localhost:3000/login');
    }
  }
);

// 로그아웃 (선택 사항: JWT 기반에서는 클라이언트에서 토큰 삭제만으로 충분)
router.get('/logout', (req, res) => {
  // ✅ 수정된 부분: JWT 기반에서는 서버 측 세션 관리 불필요
  // 기존 코드 (req.logout(() => { ... })) 주석 처리 또는 삭제 가능
  res.status(200).json({ message: '로그아웃 성공! (클라이언트에서 토큰 삭제 필요)' });
});

module.exports = router;