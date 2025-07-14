const express = require('express');
const router = express.Router();
const { getMyPage } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/mypage', authMiddleware, getMyPage);
router.get('/me', authMiddleware, (req, res) => {
    res.json({ user: req.user });
  });

module.exports = router;