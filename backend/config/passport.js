const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// ✔️ 구글 전략 설정
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback",
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        // ⚠️ 이메일도 같이 저장하는 게 좋아
        user = await User.create({
          googleId: profile.id,
          userId: profile.emails[0].value,
          password: 'google-oauth',
        });
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

// ✔️ 세션에 사용자 정보 저장 (직렬화)
passport.serializeUser((user, done) => {
  done(null, user.id); // user._id 또는 user.id 사용
});

// ✔️ 세션에서 사용자 정보 복원 (역직렬화)
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
