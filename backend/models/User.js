const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  // ✅ '로그인용 ID' - 더 이상 변경하지 않습니다.
  userId: { 
    type: String, 
    unique: true,
    required: true 
  },
  password: { type: String },
  googleId: { type: String, unique: true, sparse: true },
  
  // ✅ '화면에 보여줄 닉네임' - 이 필드를 새로 추가하고 변경합니다.
  nickname: {
    type: String,
    unique: true,
    required: false, 
  }
});

// 일반 회원가입할 때만 비번 해시
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);