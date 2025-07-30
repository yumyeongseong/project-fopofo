// userUploadController.js

const Upload = require('../models/Upload');
const { S3Client, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
require('dotenv').config();

// S3 클라이언트 생성
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
  // URL 유효시간 5분으로 설정
  return getSignedUrl(s3Client, command, { expiresIn: 60 * 5 });
};

// 여러 항목에 대해 Presigned URL을 병렬로 생성하는 함수
const createPresignedUrls = async (items) => {
  const promises = items.map(async (item) => ({
    ...item.toObject(),
    presignedUrl: await generatePresignedUrl(item.fileName),
  }));
  return Promise.all(promises);
};

// --- 파일 타입별 조회(Read) API ---

exports.getImages = async (req, res) => {
  try {
    const images = await Upload.find({ user: req.user._id, fileType: 'image' });
    const data = await createPresignedUrls(images);
    res.status(200).json({ message: '이미지 조회 성공', data });
  } catch (err) {
    res.status(500).json({ message: '서버 오류', error: err.message });
  }
};

exports.getVideos = async (req, res) => {
  try {
    const videos = await Upload.find({ user: req.user._id, fileType: 'video' });
    const data = await createPresignedUrls(videos);
    res.status(200).json({ message: '동영상 조회 성공', data });
  } catch (err) {
    res.status(500).json({ message: '서버 오류', error: err.message });
  }
};

exports.getDocuments = async (req, res) => {
  try {
    const documents = await Upload.find({ user: req.user._id, fileType: 'document' });
    const data = await createPresignedUrls(documents);
    res.status(200).json({ message: '문서 조회 성공', data });
  } catch (err) {
    res.status(500).json({ message: '서버 오류', error: err.message });
  }
};

exports.getDesigns = async (req, res) => {
  try {
    const designs = await Upload.find({ user: req.user._id, fileType: 'design' });
    const data = await createPresignedUrls(designs);
    res.status(200).json({ message: '디자인 이미지 조회 성공', data });
  } catch (err) {
    res.status(500).json({ message: '서버 오류', error: err.message });
  }
};

// ✅ [신규] 포토(photo) 타입 조회 API
exports.getPhotos = async (req, res) => {
  try {
    const photos = await Upload.find({ user: req.user._id, fileType: 'photo' });
    const data = await createPresignedUrls(photos);
    res.status(200).json({ message: '포토 조회 성공', data });
  } catch (err) {
    res.status(500).json({ message: '서버 오류', error: err.message });
  }
};

// ✅ [개선] 가장 최신 자기소개서(resume) 1개만 조회하는 API
exports.getResume = async (req, res) => {
  try {
    const file = await Upload.findOne({ user: req.user._id, fileType: 'resume' }).sort({ uploadedAt: -1 });

    if (!file) {
      return res.status(200).json({ message: "업로드된 자기소개서가 없습니다.", data: null });
    }
    const presignedUrl = await generatePresignedUrl(file.fileName);
    res.status(200).json({
      message: "최신 자기소개서 조회 성공",
      data: { ...file.toObject(), presignedUrl },
    });
  } catch (err) {
    res.status(500).json({ message: "자기소개서 조회 중 서버 오류 발생", error: err.message });
  }
};

// --- 삭제(Delete) API ---
exports.deleteUpload = async (req, res) => {
  try {
    const uploadToDelete = await Upload.findOne({ _id: req.params.id, user: req.user._id });
    if (!uploadToDelete) {
      return res.status(404).json({ message: "삭제할 파일을 찾을 수 없습니다." });
    }

    const command = new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: uploadToDelete.fileName,
    });
    await s3Client.send(command);
    await Upload.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "삭제 성공" });
  } catch (err) {
    res.status(500).json({ message: "서버 오류", error: err.message });
  }
};

// --- 수정(Update) API ---
exports.updateUpload = async (req, res) => {
  try {
    const newFile = req.file;
    if (!newFile) {
      return res.status(400).json({ message: '수정할 새 파일이 없습니다.' });
    }

    const existingUpload = await Upload.findOne({ _id: req.params.id, user: req.user._id });
    if (!existingUpload) {
      // S3에 업로드된 새 파일을 다시 삭제 (DB에 원본이 없으므로)
      const delCommand = new DeleteObjectCommand({ Bucket: process.env.S3_BUCKET_NAME, Key: newFile.key });
      await s3Client.send(delCommand);
      return res.status(404).json({ message: '수정할 원본 파일을 찾을 수 없습니다.' });
    }

    // S3에서 기존 파일 삭제
    const delCommand = new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: existingUpload.fileName,
    });
    await s3Client.send(delCommand);

    // DB 정보 업데이트
    existingUpload.fileName = newFile.key;
    existingUpload.filePath = newFile.location;
    existingUpload.originalName = newFile.originalname;
    existingUpload.updatedAt = new Date();
    await existingUpload.save();

    res.status(200).json({ message: '수정 완료', data: existingUpload });
  } catch (err) {
    res.status(500).json({ message: '수정 실패', error: err.message });
  }
};

// ✅ [신규] 특정 유저의 모든 이력서/자기소개서(resume) 파일 삭제 API
exports.deleteAllResumes = async (req, res) => {
  try {
    const resumesToDelete = await Upload.find({ user: req.user._id, fileType: 'resume' });

    if (!resumesToDelete || resumesToDelete.length === 0) {
      return res.status(200).json({ message: "삭제할 기존 파일이 없습니다." });
    }

    // S3에서 모든 파일을 동시에 삭제
    const deleteS3Promises = resumesToDelete.map(file => {
      const command = new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: file.fileName,
      });
      return s3Client.send(command);
    });
    await Promise.all(deleteS3Promises);

    // MongoDB에서 모든 파일 정보를 한 번에 삭제
    await Upload.deleteMany({ user: req.user._id, fileType: 'resume' });

    res.status(200).json({ message: "기존 이력서/자기소개서 파일 모두 삭제 성공" });
  } catch (err) {
    res.status(500).json({ message: "파일 삭제 중 서버 오류 발생", error: err.message });
  }
};