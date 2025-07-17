const Upload = require('../models/Upload');
const User = require('../models/User');

exports.uploadFile = async (req, res) => {
    try {
      const file = req.file;
      const fileType = req.params.type;
      const userId = req.user.userId; 
  
      if (!file) {
        return res.status(400).json({ message: '파일이 없습니다.' });
      }

    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }
  
      const uploadData = new Upload({
        user: user._id,
        fileType,
        fileName: file.key,          // ✅ 수정: S3의 파일 key (경로 포함)
        filePath: file.location,     // ✅ 수정: S3 파일의 전체 URL
        originalName: file.originalname,
      });
  
      await uploadData.save();
  
      res.status(201).json({ message: '업로드 성공', data: uploadData });
    } catch (err) {
      res.status(500).json({ message: '서버 오류', error: err.message });
    }
  };
