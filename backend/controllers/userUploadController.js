const Upload = require('../models/Upload');
const fs = require('fs');


// 이미지 조회
exports.getImages = async (req, res) => {
    console.log('✅req.user._id:', req.user._id);
  try {
    const userId = req.user._id;
    const images = await Upload.find({ user: userId, fileType: 'image' });
    res.status(200).json({ message: '이미지 조회 성공', data: images });
  } catch (err) {
    res.status(500).json({ message: '서버 오류', error: err.message });
  }
};

// 동영상 조회
exports.getVideos = async (req, res) => {
  try {
    const userId = req.user._id;
    const videos = await Upload.find({ user: userId, fileType: 'video' });
    res.status(200).json({ message: '동영상 조회 성공', data: videos });
  } catch (err) {
    res.status(500).json({ message: '서버 오류', error: err.message });
  }
};

// 문서 조회
exports.getDocuments = async (req, res) => {
  try {
    const userId = req.user._id;
    const documents = await Upload.find({ user: userId, fileType: 'document' });
    res.status(200).json({ message: '문서 조회 성공', data: documents });
  } catch (err) {
    res.status(500).json({ message: '서버 오류', error: err.message });
  }
};

// 디자인 이미지 조회
exports.getDesigns = async (req, res) => {
  try {
    const userId = req.user._id;
    const designs = await Upload.find({ user: userId, fileType: 'design' });
    res.status(200).json({ message: '디자인 이미지 조회 성공', data: designs });
  } catch (err) {
    res.status(500).json({ message: '서버 오류', error: err.message });
  }
};

exports.deleteUpload = async (req, res) => {
    try {
      const uploadId = req.params.id;
      const userId = req.user._id;
  
      const deleted = await Upload.findOneAndDelete({ _id: uploadId, user: userId });
      if (!deleted) {
        return res.status(404).json({ message: "파일을 찾을 수 없습니다." });
      }
  
      res.status(200).json({ message: "삭제 성공", data: deleted });
    } catch (err) {
      res.status(500).json({ message: "서버 오류", error: err.message });
    }
  };


exports.updateUpload = async (req, res) => {
  try {
    const uploadId = req.params.id;
    const userId = req.user._id;

    const existingUpload = await Upload.findById(uploadId);

    if (!existingUpload) {
      return res.status(404).json({ message: '업로드 항목을 찾을 수 없음' });
    }

    if (existingUpload.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: '권한이 없습니다' });
    }

    // ✅ 기존 파일 삭제
    if (fs.existsSync(existingUpload.filePath)) {
      fs.unlinkSync(existingUpload.filePath);
    }

    // ✅ 새 파일 정보로 덮어쓰기
    const newFile = req.file;
    if (!newFile) {
      return res.status(400).json({ message: '새 파일이 존재하지 않습니다.' });
    }

    existingUpload.fileName = newFile.filename;
    existingUpload.filePath = newFile.path;
    existingUpload.originalName = newFile.originalname;
    existingUpload.updatedAt = new Date();

    await existingUpload.save();

    res.status(200).json({ message: '수정 완료', data: existingUpload });
  } catch (err) {
    res.status(500).json({ message: '수정 실패', error: err.message });
  }
};

