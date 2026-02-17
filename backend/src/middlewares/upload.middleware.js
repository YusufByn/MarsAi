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