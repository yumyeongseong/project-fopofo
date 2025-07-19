const express = require('express');
const router = express.Router();
const { signup, login, logout } = require('../controllers/authController');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;