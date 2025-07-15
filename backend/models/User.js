const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  userId: { type: String, unique: true },          // 일반 회원가입용
  password: { type: String },                      // 일반 회원가입용
  googleId: { type: String, unique: true, sparse: true } // 구글 로그인 사용자 ID
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