import multer from 'multer';
import path from 'path';
import fs from 'fs';

// dossier selon le type (cover, video etc)
const folders = {
    video: "uploads/videos",
    cover: "uploads/covers",
    still: "uploads/stills",
    srt: "uploads/srt"
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