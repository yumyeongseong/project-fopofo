const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
require('dotenv').config();

// v3 방식의 S3 클라이언트 생성
const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: 'ap-southeast-2',
});

const upload = multer({
  storage: multerS3({
    s3: s3, // v3 클라이언트를 전달
    bucket: process.env.S3_BUCKET_NAME,
    acl: 'private',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const userId = req.user.userId;
      const fileType = req.params.type;
      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, `${userId}/${fileType}/${uniqueName}`);
    },
  }),
  limits: { fileSize: 50 * 1024 * 1024 },
});

module.exports = upload;