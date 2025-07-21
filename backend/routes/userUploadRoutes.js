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
  deleteUpload,
  updateUpload,
<<<<<<< HEAD
=======
  deleteAllResumes,
  getPhotos,
>>>>>>> upstream/main
} = require('../controllers/userUploadController');

router.get('/images', authMiddleware, getImages);
router.get('/videos', authMiddleware, getVideos);
router.get('/documents', authMiddleware, getDocuments);
router.get('/designs', authMiddleware, getDesigns);
router.get('/resume', authMiddleware, getResume);
<<<<<<< HEAD

=======
router.get('/photos', authMiddleware, getPhotos);

router.delete('/resume/all', authMiddleware, deleteAllResumes);
>>>>>>> upstream/main
router.delete("/delete/:id", authMiddleware, deleteUpload);
router.put("/update/:type/:id", authMiddleware, upload.single("file"), updateUpload);


module.exports = router;