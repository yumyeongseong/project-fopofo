const express = require('express');
const router = express.Router();

const upload = require('../middlewares/multerConfig');
const { uploadFile } = require('../controllers/uploadController');
const authMiddleware = require('../middlewares/authMiddleware');

// POST /api/upload/image | video | document | design
router.post('/:type', authMiddleware, upload.single('file'), uploadFile);

module.exports = router;
