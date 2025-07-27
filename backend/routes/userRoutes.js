const express = require('express');
const router = express.Router();
const { getMyPage } = require('../controllers/authController');

const { setUserNickname, getUserProfile } = require('../controllers/userController');

const authMiddleware = require('../middlewares/authMiddleware');


router.put('/set-nickname', authMiddleware, setUserNickname);
router.get('/mypage', authMiddleware, getMyPage);
router.get('/me', authMiddleware, getUserProfile);

module.exports = router;