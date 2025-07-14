const Upload = require('../models/Upload');
const User = require('../models/User');

exports.uploadFile = async (req, res) => {
    try {
      const file = req.file;
      const fileType = req.params.type;
      const userId = req.user.userId;  // ✅ 여기가 핵심 수정!
  
      if (!file) {
        return res.status(400).json({ message: '파일이 없습니다.' });
      }

    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }
  
      const uploadData = new Upload({
        user: user._id,                  // ✅ 여기에도 반영
        fileType,
        fileName: file.filename,
        filePath: file.path,
        originalName: file.originalname,
      });
  
      await uploadData.save();
  
      res.status(201).json({ message: '업로드 성공', data: uploadData });
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
      const file = req.file;
  
      if (!file) return res.status(400).json({ message: "파일이 없습니다." });
  
      const updated = await Upload.findOneAndUpdate(
        { _id: uploadId, user: userId },
        {
          fileName: file.filename,
          filePath: file.path,
          originalName: file.originalname,
          uploadedAt: Date.now()
        },
        { new: true }
      );
  
      if (!updated) {
        return res.status(404).json({ message: "파일을 찾을 수 없습니다." });
      }
  
      res.status(200).json({ message: "업데이트 성공", data: updated });
    } catch (err) {
      res.status(500).json({ message: "서버 오류", error: err.message });
    }
  };



