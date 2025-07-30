// authController.js

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

    // 비밀번호 해싱 (보안상 중요)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ userId, password: hashedPassword });
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
      _id: user._id.toString()
    });

    // ✅ 로그인 시 프론트에서 바로 사용할 수 있도록 user 정보 포함
    res.status(200).json({
      message: "로그인 성공",
      token,
      user: {
        _id: user._id.toString(),
        userId: user.userId,
        nickname: user.nickname
      }
    });

  } catch (err) {
    res.status(500).json({ message: "로그인 실패", error: err.message });
  }
};

exports.logout = (req, res) => {
  // ✅ 세션을 사용하는 경우, 올바른 로그아웃 처리
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "로그아웃 실패", error: err.message });
    }
    req.session.destroy();
    res.clearCookie('connect.sid');
    res.status(200).json({ message: "로그아웃 완료" });
  });
};

exports.getMyPage = async (req, res) => {
  try {
    // ✅ JWT 토큰의 정보 대신, DB에서 최신 사용자 정보를 조회 (더 안전)
    const fullUser = await User.findById(req.user._id).select('-password');

    if (!fullUser) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    res.status(200).json({
      message: '마이페이지 정보',
      user: fullUser, // 닉네임 등 최신 정보가 포함된 user 객체
    });
  } catch (err) {
    res.status(500).json({ message: '서버 에러', error: err.message });
  }
};