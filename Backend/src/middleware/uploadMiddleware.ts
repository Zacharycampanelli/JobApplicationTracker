import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { NextFunction, Response } from 'express';
import { AuthRequest } from './authMiddleware';

// Resume upload
const uploadDir = path.join(process.cwd(), 'uploads', 'resumes');

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}${Math.round(Math.random() * 1e9)}`;
    const extension = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extension);
    cb(null, `${basename}-${uniqueSuffix}${extension}`);
  },
});

const allowedMimeTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const uploadResumeFile = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error('Only PDF, DOC, AND DOCX files are allowed.'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export const handleResumeUpload = (req: AuthRequest, res: Response, next: NextFunction) => {
  uploadResumeFile.single('resume')(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      return res.status(400).json({ message: error.message });
    }
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    next();
  });
};

// Avatar upload
const avatarUploadDir = path.join(process.cwd(), 'uploads', 'avatars')

fs.mkdirSync(avatarUploadDir, { recursive: true });

const avatarStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, avatarUploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}${Math.round(Math.random() * 1e9)}`;
    const extension = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extension);
    cb(null, `${basename}-${uniqueSuffix}${extension}`);
  },
});

const allowedAvatarMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp"
]

const uploadAvatarFile = multer({
  storage: avatarStorage,
  fileFilter: (_req, file, cb) => {
    if (!allowedAvatarMimeTypes.includes(file.mimetype)) {
      return cb(new Error('Only JPG, PNG, and WEBP files are allowed.'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

export const uploadAvatarMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  uploadAvatarFile.single('avatar')(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      return res.status(400).json({ message: error.message });
    }
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    next();
  });
};