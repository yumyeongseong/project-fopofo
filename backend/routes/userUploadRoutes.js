// routes/userUploadRoutes.js

const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multerConfig');
const authMiddleware = require('../middlewares/authMiddleware');
const {
  getImages,
  getVideos,
  getDocuments,
  getDesigns,
  getResume,
  getPhotos, // ✅ 추가된 부분
  deleteUpload,
  updateUpload,
  deleteAllResumes, // ✅ 추가된 부분
} = require('../controllers/userUploadController');

// --- GET (조회) ---
router.get('/images', authMiddleware, getImages);
router.get('/videos', authMiddleware, getVideos);
router.get('/documents', authMiddleware, getDocuments);
router.get('/designs', authMiddleware, getDesigns);
router.get('/resume', authMiddleware, getResume);
router.get('/photos', authMiddleware, getPhotos); // ✅ 추가된 라우트

// --- DELETE (삭제) ---
router.delete('/delete/:id', authMiddleware, deleteUpload);
router.delete('/resume/all', authMiddleware, deleteAllResumes); // ✅ 추가된 라우트

// --- PUT (수정) ---
router.put('/update/:type/:id', authMiddleware, upload.single('file'), updateUpload);

module.exports = router;