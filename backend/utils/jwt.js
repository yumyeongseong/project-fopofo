const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const secret = process.env.JWT_SECRET;
const expiresIn = process.env.JWT_EXPIRES_IN || '1d';

exports.generateToken = (payload) => {
  return jwt.sign(payload, secret, { expiresIn });
};

exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    return null;
  }
};