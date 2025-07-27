const User = require('../models/User');
const Upload = require('../models/Upload');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
require('dotenv').config();

const s3Client = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: 'ap-southeast-2',
});

const generatePresignedUrl = async (key) => {
    if (!key) return null;
    const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
    });
    return getSignedUrl(s3Client, command, { expiresIn: 3600 });
};


// --- 3. 공개 포트폴리오 조회 함수 ---
const getPublicPortfolio = async (req, res) => {
    try {
        // ✅ 1. 어떤 userId로 요청이 들어왔는지 확인
        console.log("--- [포트폴리오 API 요청 시작] ---");
        console.log("요청된 userId:", req.params.userId);

        const user = await User.findOne({ userId: req.params.userId });

        // ✅ 2. DB에서 해당 userId로 사용자를 찾았는지 확인
        if (!user) {
            console.log("DB에서 해당 사용자를 찾지 못했습니다.");
            return res.status(404).json({ message: '해당 사용자를 찾을 수 없습니다.' });
        }
        console.log("DB에서 찾은 사용자 정보 (MongoDB _id):", user._id);

        const uploads = await Upload.find({ user: user._id, fileType: { $ne: 'resume' } });

        // ✅ 3. 찾은 사용자의 _id로 포트폴리오 데이터를 조회한 결과 확인
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
        
        // 3. 최종 데이터를 성공적으로 응답합니다.
        res.status(200).json({ 
            message: '포트폴리오 조회 성공', 
            userNickname: user.nickname,
            data: portfolioData 
        });
    } catch (err) {
        console.error("!!! 포트폴리오 API 오류 발생:", err); // ✅ 에러 로그 추가
        res.status(500).json({ message: '서버 오류', error: err.message });
    }
};


// --- 4. 공개 자기소개서 조회 함수 ---
const getPublicIntro = async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.params.userId });

        if (!user) {
            return res.status(404).json({ message: '해당 사용자를 찾을 수 없습니다.' });
        }

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


// --- 5. 위에서 정의한 함수들을 다른 파일에서 사용할 수 있도록 내보냅니다. ---
module.exports = {
    getPublicPortfolio,
    getPublicIntro
};