const Upload = require('../models/Upload');
const User = require('../models/User'); 

exports.uploadFile = async (req, res) => {

    try {
      const file = req.file;
      const fileType = req.params.type;
      
      const userObjectId = req.user._id; 
  
      if (!file) {
        return res.status(400).json({ message: '파일이 없습니다.' });
      }
  
      const uploadData = new Upload({
        user: userObjectId,
        fileType,
        fileName: file.key,          
        filePath: file.location,     
        originalName: file.originalname,
      });
  
      console.log("--- [MongoDB 저장 시도] 저장될 데이터: ---");
      console.log(uploadData);

      try {
        await uploadData.save();
        res.status(201).json({ message: '업로드 성공', data: uploadData });

      } catch (mongoError) {
        return res.status(500).json({ message: "DB에 파일 정보를 저장하는 중 오류가 발생했습니다.", error: mongoError.message });
      }
  
    } catch (err) {
      res.status(500).json({ message: '서버 오류', error: err.message });
    }
  };