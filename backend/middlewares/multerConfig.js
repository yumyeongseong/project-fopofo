// middlewares/multerConfig.js

const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
require('dotenv').config();

// S3 클라이언트 생성
const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: 'ap-southeast-2',
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    acl: 'private', // 외부 직접 접근을 막기 위해 private으로 설정
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      // req.user가 없을 경우를 대비한 방어 코드
      if (!req.user || !req.user.userId) {
        return cb(new Error('인증 정보가 올바르지 않아 파일 키를 생성할 수 없습니다.'));
      }
      const userId = req.user.userId;
      const fileType = req.params.type;
      const uniqueName = `${Date.now()}-${file.originalname}`;
      // 파일 경로: {유저ID}/{파일타입}/{타임스탬프}-{원본파일이름}
      cb(null, `${userId}/${fileType}/${uniqueName}`);
    },
  }),
  // ✅ 파일 사이즈 제한 500MB로 설정
  // 참고: 500MB는 매우 큰 용량이므로, 실제 서비스 정책에 맞게 조정하는 것을 권장합니다.
  limits: { fileSize: 500 * 1024 * 1024 },
});

module.exports = upload;