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
        const userEmail = (profile.emails && profile.emails.length > 0) ? profile.emails[0].value : `google_${profile.id}@example.com`;
        user = await User.create({
          googleId: profile.id,
          userId: userEmail,
          password: 'google-oauth-placeholder',
        });
      }
      return done(null, user);
    } catch (err) {
      console.error('Error in Google Strategy:', err);
      return done(err, null);
    }
  }
));

// ✔️ 세션에 사용자 정보 저장 (직렬화) - JWT만 쓴다면 이 부분은 불필요하므로 주석 처리하거나 제거하는 것을 고려
// passport.serializeUser((user, done) => {
//   // console.log('Serialize User:', user.id); // ✅ 제거된 부분
//   done(null, user.id);
// });

// // ✔️ 세션에서 사용자 정보 복원 (역직렬화) - JWT만 쓴다면 이 부분은 불필요하므로 주석 처리하거나 제거하는 것을 고려
// passport.deserializeUser(async (id, done) => {
//   // console.log('Deserialize User ID:', id); // ✅ 제거된 부분
//   try {
//     const user = await User.findById(id);
//     done(null, user);
//   } catch (err) {
//     // 운영 환경에서는 에러를 로깅 시스템에 보내거나, 적절히 처리해야 함
//     console.error('Error in Deserialize User:', err);
//     done(err, null);
//   }
// });

module.exports = passport;