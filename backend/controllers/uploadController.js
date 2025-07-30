// uploadController.js

const Upload = require('../models/Upload');
const User = require('../models/User');

exports.uploadFile = async (req, res) => {
  try {
    const file = req.file;
    const fileType = req.params.type;

    // ✅ 인증 미들웨어에서 넘어온 사용자 _id를 직접 사용 (DB 조회 X)
    const userObjectId = req.user._id;

    if (!file) {
      return res.status(400).json({ message: '파일이 없습니다.' });
    }

    const uploadData = new Upload({
      user: userObjectId,
      fileType,
      fileName: file.key,          // S3의 파일 key (경로 포함)
      filePath: file.location,     // S3 파일의 전체 URL
      originalName: file.originalname,
    });

    console.log("--- [MongoDB 저장 시도] 저장될 데이터: ---");
    console.log(uploadData);

    // ✅ DB 저장 로직만 별도로 오류 처리
    try {
      await uploadData.save();
      res.status(201).json({ message: '업로드 성공', data: uploadData });

    } catch (mongoError) {
      console.error("!!! MongoDB 저장 오류:", mongoError);
      return res.status(500).json({ message: "DB에 파일 정보를 저장하는 중 오류가 발생했습니다.", error: mongoError.message });
    }

  } catch (err) {
    console.error("!!! 업로드 처리 중 서버 오류:", err);
    res.status(500).json({ message: '서버 오류', error: err.message });
  }
};