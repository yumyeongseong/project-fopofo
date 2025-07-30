// models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  // '로그인용 ID' - 고유값이며 필수
  userId: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },

  // '화면에 보여줄 닉네임' - 고유값이나, 최초 가입 시 비어있을 수 있음
  nickname: {
    type: String,
    unique: true,
    required: false,
  }
});

// 일반 회원가입 시에만 비밀번호 해싱
userSchema.pre('save', async function (next) {
  // 비밀번호 필드가 수정되었을 때만 해싱 실행
  if (!this.isModified('password') || !this.password) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// 비밀번호 비교 메서드
userSchema.methods.comparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);