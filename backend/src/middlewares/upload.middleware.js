import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// dossier selon le type (cover, video etc)
// Chemins absolus relatifs a src/uploads/ pour matcher express.static dans app.js
const folders = {
    video: path.join(__dirname, '..', 'uploads', 'videos'),
    cover: path.join(__dirname, '..', 'uploads', 'covers'),
    still: path.join(__dirname, '..', 'uploads', 'stills'),
    srt: path.join(__dirname, '..', 'uploads', 'srt')
}

// si dossier n'existe pas, on le crée
const ensureDir = (dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, {
        recursive : true
    });
};

// la ou l'on va stocker les fichiers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // variable qui permet de stocker le fichier dans le dossier correspondant 
        let dir = folders.video;

        
        if (file.fieldname === "cover") dir = folders.cover;
        if (file.fieldname === "stills") dir = folders.still;
        if (file.fieldname === "srt") dir = folders.srt;

        ensureDir(dir);
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = {
        video: ["video/mp4", "video/quicktime", "video/x-matroska", "video/webm", "video/mov"],
        cover: ["image/jpeg", "image/png", "image/webp", "image/jpg"],
        stills: ["image/jpeg", "image/png", "image/webp", "image/jpg"],
        srt: ["text/plain", "application/srt", "application/x-subrip"],
    };

    if (allowedTypes[file.fieldname]?.includes(file.mimetype)) { 
        cb(null, true);
    } else {
        cb(new Error("File type not supported : " + file.mimetype), false);
    }
}

const readHeader = async (filePath, bytes = 64) => {
    const fd = await fs.promises.open(filePath, 'r');
    try {
        const buffer = Buffer.alloc(bytes);
        const { bytesRead } = await fd.read(buffer, 0, bytes, 0);
        return buffer.subarray(0, bytesRead);
    } finally {
        await fd.close();
    }
};

const isJpeg = (buffer) =>
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff;

const isPng = (buffer) =>
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a;

const isWebp = (buffer) =>
    buffer.length >= 12 &&
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP';

const isMp4OrMov = (buffer) =>
    buffer.length >= 12 &&
    buffer.toString('ascii', 4, 8) === 'ftyp';

const isWebmOrMkv = (buffer) =>
    buffer.length >= 4 &&
    buffer[0] === 0x1a &&
    buffer[1] === 0x45 &&
    buffer[2] === 0xdf &&
    buffer[3] === 0xa3;

const isLikelyText = (buffer) => {
    if (!buffer.length) return false;
    let printable = 0;
    for (const byte of buffer) {
        if (byte === 0x09 || byte === 0x0a || byte === 0x0d || (byte >= 0x20 && byte <= 0x7e)) {
            printable++;
        }
    }
    return printable / buffer.length > 0.85;
};

const isValidBySignature = async (file) => {
    const header = await readHeader(file.path);

    if (file.fieldname === 'cover' || file.fieldname === 'stills') {
        return isJpeg(header) || isPng(header) || isWebp(header);
    }

    if (file.fieldname === 'video') {
        return isMp4OrMov(header) || isWebmOrMkv(header);
    }

    if (file.fieldname === 'srt') {
        return isLikelyText(header);
    }

    return false;
};

export const cleanupUploadedFiles = async (req) => {
    const files = Object.values(req.files || {}).flat();
    await Promise.all(
        files.map((file) => (file?.path ? fs.promises.unlink(file.path).catch(() => null) : Promise.resolve()))
    );
};

export const validateUploadedFilesContent = async (req, res, next) => {
    try {
        const files = Object.values(req.files || {}).flat();
        for (const file of files) {
            const valid = await isValidBySignature(file);
            if (!valid) {
                await cleanupUploadedFiles(req);
                return res.status(400).json({
                    success: false,
                    message: 'Validation des fichiers échouée',
                    errors: [
                        {
                            field: file.fieldname,
                            message: 'Le contenu du fichier ne correspond pas au format attendu',
                        },
                    ],
                });
            }
        }
        next();
    } catch (error) {
        await cleanupUploadedFiles(req);
        return res.status(500).json({
            success: false,
            message: 'Erreur interne lors de la validation des fichiers',
        });
    }
};


export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 200 * 1024 * 1024 },
}).fields([
    { name: "video", maxCount: 1 },
    { name: "cover", maxCount: 1 },
    { name: "stills", maxCount: 3 },
    { name: "srt", maxCount: 1 },
]);

export const uploadCoverOnly = multer({
    storage,
    fileFilter,
    limits: { fileSize: 15 * 1024 * 1024 },
}).single('cover');

export const uploadStillsOnly = multer({
    storage,
    fileFilter,
    limits: { fileSize: 7 * 1024 * 1024 },
}).array('stills', 3);