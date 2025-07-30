// publicController.js

const User = require('../models/User');
const Upload = require('../models/Upload');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
require('dotenv').config();

// S3 클라이언트 설정
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
    // URL 유효시간 1시간으로 설정
    return getSignedUrl(s3Client, command, { expiresIn: 3600 });
};


// --- 공개 포트폴리오 조회 함수 ---
const getPublicPortfolio = async (req, res) => {
    try {
        console.log("--- [포트폴리오 API 요청 시작] ---");
        console.log("요청된 userId:", req.params.userId);

        const user = await User.findOne({ userId: req.params.userId });

        if (!user) {
            console.log("DB에서 해당 사용자를 찾지 못했습니다.");
            return res.status(404).json({ message: '해당 사용자를 찾을 수 없습니다.' });
        }
        console.log("DB에서 찾은 사용자 정보 (MongoDB _id):", user._id);

        // ✅ 'resume' 타입을 제외한 모든 파일 조회
        const uploads = await Upload.find({ user: user._id, fileType: { $ne: 'resume' } });

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

        // ✅ 응답에 사용자 닉네임 포함
        res.status(200).json({
            message: '포트폴리오 조회 성공',
            userNickname: user.nickname,
            data: portfolioData
        });
    } catch (err) {
        console.error("!!! 포트폴리오 API 오류 발생:", err);
        res.status(500).json({ message: '서버 오류', error: err.message });
    }
};


// ✅ [신규] 공개 자기소개서 조회 함수
const getPublicIntro = async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.params.userId });

        if (!user) {
            return res.status(404).json({ message: '해당 사용자를 찾을 수 없습니다.' });
        }

        // ✅ 'resume' 타입의 파일 중 가장 최신 파일 하나만 조회
        const introUpload = await Upload.findOne({ user: user._id, fileType: 'resume' }).sort({ uploadedAt: -1 });

        if (!introUpload) {
            return res.status(200).json({ message: '업로드된 자기소개서가 없습니다.', data: null });
        }

        const presignedUrl = await generatePresignedUrl(introUpload.fileName);

        res.status(200).json({
            message: '자기소개서 조회 성공',
            data: { ...introUpload.toObject(), presignedUrl }
        });
    } catch (err) {
        res.status(500).json({ message: '서버 오류', error: err.message });
    }
};


// ✅ 두 함수 모두 exports
module.exports = {
    getPublicPortfolio,
    getPublicIntro
};