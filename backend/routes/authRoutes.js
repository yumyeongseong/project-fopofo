const express = require('express');
const router = express.Router();
const { signup, login, logout } = require('../controllers/authController');
<<<<<<< HEAD
=======
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
>>>>>>> upstream/main

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
<<<<<<< HEAD
=======
router.post('/logout', authMiddleware, authController.logout);
>>>>>>> upstream/main

module.exports = router;