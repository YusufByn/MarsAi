import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { randomBytes } from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const coversDir = path.join(__dirname, '..', '..', 'uploads', 'covers');

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureDir(coversDir);
    cb(null, coversDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = randomBytes(6).toString('hex');
    const extension = path.extname(file.originalname || '').toLowerCase();
    cb(null, `${Date.now()}-${uniqueSuffix}${extension}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
    return;
  }

  cb(new Error(`File type not supported: ${file.mimetype}`), false);
};

export const uploadSponsorCover = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single('cover');
