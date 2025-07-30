// passport.js

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// ✔️ 구글 전략 설정
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  passReqToCallback: true
},
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        // profile.emails가 없는 경우를 대비한 방어 코드
        const userEmail = (profile.emails && profile.emails.length > 0) ? profile.emails[0].value : `google_${profile.id}@example.com`;
        user = await User.create({
          googleId: profile.id,
          userId: userEmail,
          password: 'google-oauth-placeholder', // 소셜 로그인 사용자는 별도의 비밀번호 불필요
        });
      }
      return done(null, user);
    } catch (err) {
      console.error('Error in Google Strategy:', err);
      return done(err, null);
    }
  }
));

// ✅ JWT 방식을 사용하므로 세션 관련 코드는 불필요하여 주석 처리합니다.
// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// ✅ JWT 방식을 사용하므로 세션 관련 코드는 불필요하여 주석 처리합니다.
// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id);
//     done(null, user);
//   } catch (err) {
//     done(err, null);
//   }
// });

module.exports = passport;