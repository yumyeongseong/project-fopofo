const User = require('../models/User');
const Upload = require('../models/Upload');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
require('dotenv').config();

// S3 클라이언트 설정 (userUploadController와 동일)
const s3Client = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: 'ap-southeast-2', 
});

// Presigned URL 생성 헬퍼 함수
const generatePresignedUrl = async (key) => {
    if (!key) return null;
    const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
    });
    return getSignedUrl(s3Client, command, { expiresIn: 60 * 5 });
};

// --- 공개 포트폴리오 조회 API 로직 ---
exports.getPublicPortfolio = async (req, res) => {
    try {
        // 1. URL 파라미터로 받은 userId로 사용자 정보 찾기
        const user = await User.findOne({ userId: req.params.userId });
        if (!user) {
            return res.status(404).json({ message: '해당 사용자를 찾을 수 없습니다.' });
        }

        // 2. 찾은 사용자의 _id로 모든 업로드 파일 조회
        const uploads = await Upload.find({ user: user._id });

        // 3. 각 파일에 대해 presigned URL 생성
        const portfolioData = {};
        for (const upload of uploads) {
            if (!portfolioData[upload.fileType]) {
                portfolioData[upload.fileType] = [];
            }
            const presignedUrl = await generatePresignedUrl(upload.fileName);
            portfolioData[upload.fileType].push({
                ...upload.toObject(),
                presignedUrl,
            });
        }
        
        res.status(200).json({ message: '포트폴리오 조회 성공', data: portfolioData });
    } catch (err) {
        res.status(500).json({ message: '서버 오류', error: err.message });
    }
};