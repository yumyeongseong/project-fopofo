const User = require('../models/User');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt'); 

exports.signup = async (req, res) => {
  const { userId, password } = req.body;

  try {
    const existing = await User.findOne({ userId });
    if (existing) {
      return res.status(400).json({ message: "이미 사용 중인 ID입니다." });
    }

    // 🔥 해싱 제거
    const user = new User({ userId, password });

    await user.save();
    res.status(201).json({ message: "회원가입 완료" });
  } catch (err) {
    res.status(500).json({ message: "회원가입 실패", error: err.message });
  }
};

exports.login = async (req, res) => {
  const { userId, password } = req.body;

  try {
    const user = await User.findOne({ userId });
    if (!user) return res.status(401).json({ message: "존재하지 않는 ID입니다." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "비밀번호가 틀렸습니다." });

    const token = generateToken({
      userId: user.userId,
      _id: user._id.toString()  // ObjectId도 넣어줌
    });
    res.status(200).json({ message: "로그인 성공", token }); // 토큰 전달
  } catch (err) {
    res.status(500).json({ message: "로그인 실패", error: err.message });
  }
};


exports.logout = (req, res) => {
  req.logout(() => {
    req.session.destroy(); // 세션 삭제
    res.clearCookie('connect.sid'); // 브라우저 쿠키 삭제
    res.status(200).json({ message: "로그아웃 완료. 세션이 삭제되었습니다." });
    // 👉 로그아웃 후 프론트엔드 메인 페이지로 이동
    res.redirect('http://localhost:3000');
  });
};


exports.getMyPage = async (req, res) => {
  try {
    res.status(200).json({
      message: '마이페이지 정보',
      user: req.user,
    });
  } catch (err) {
    res.status(500).json({ message: '서버 에러', error: err.message });
  }
};
