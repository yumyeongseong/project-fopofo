// controllers/userController.js

const User = require('../models/User');

const setUserNickname = async (req, res) => {
  const { nickname } = req.body;

  if (!nickname || nickname.length < 2) {
    return res.status(400).json({ message: '닉네임은 2자 이상으로 입력해주세요.' });
  }
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      // ✅ userId가 아닌 nickname 필드를 업데이트
      user.nickname = nickname; 
      const updatedUser = await user.save();
      res.status(200).json({
        message: '닉네임이 성공적으로 설정되었습니다.',
        nickname: updatedUser.nickname, // ✅ 응답도 nickname으로 변경
      });
    } else {
      res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }
  } catch (error) {
    // ...
  }
};

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
            res.json(user); // 이 응답에는 이제 nickname 필드도 포함됩니다.
        } else {
            res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }
    } catch (error) {
        res.status(500).json({ message: '서버 오류' });
    }
};

module.exports = { setUserNickname, getUserProfile };