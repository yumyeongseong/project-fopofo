const { verifyToken } = require('../utils/jwt');

exports.authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: '토큰이 없습니다.' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ message: '토큰이 유효하지 않습니다.' });
  }

  req.user = decoded; // 사용자 정보 req에 저장
  next();
};