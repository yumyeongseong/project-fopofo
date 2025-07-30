// controllers/userController.js

const User = require('../models/User');

const setUserNickname = async (req, res) => {
  const { nickname } = req.body;
  // ✅ 인증된 사용자의 _id를 직접 사용
  const userMongoId = req.user._id;

  if (!nickname || nickname.length < 2) {
    return res.status(400).json({ message: '닉네임은 2자 이상으로 입력해주세요.' });
  }

  try {
    // ✅ findByIdAndUpdate를 사용하여 한 번의 DB 요청으로 수정 완료
    const user = await User.findByIdAndUpdate(
      userMongoId,
      { nickname }, // 업데이트할 내용
      { new: true }  // 업데이트된 후의 문서를 반환하도록 설정
    );

    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }
    res.status(200).json({ message: '닉네임이 설정되었습니다.', user });
  } catch (err) {
    res.status(500).json({ message: '닉네임 설정 실패', error: err.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      // 이 응답에는 이제 nickname 필드도 포함됩니다.
      res.json(user);
    } else {
      res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }
  } catch (error) {
    res.status(500).json({ message: '서버 오류' });
  }
};

module.exports = { setUserNickname, getUserProfile };