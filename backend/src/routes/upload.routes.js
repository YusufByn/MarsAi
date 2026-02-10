import { Router } from 'express';
import videoControllerFull from '../controllers/videoController.js';
import uploadController from '../controllers/upload.controller.js';
import upload from '../middlewares/upload.middleware.js';

const router = Router();

// Route pour créer une vidéo (métadonnées uniquement, sans fichiers)
router.post('/videos', videoControllerFull.createVideo);

// Routes pour uploader les fichiers séparément
router.put('/videos/:id/upload-video', ...upload.video, uploadController.uploadVideoFile);
router.put('/videos/:id/upload-cover', ...upload.cover, uploadController.uploadCover);
router.put('/videos/:id/upload-stills', ...upload.still, uploadController.uploadStills);
router.put('/videos/:id/upload-subtitles', ...upload.sub, uploadController.uploadSubtitles);

// Route pour ajouter des contributeurs à une vidéo
router.post('/videos/:id/contributors', videoControllerFull.addContributors);

// Route pour ajouter des réseaux sociaux à une vidéo
router.post('/videos/:id/social-media', videoControllerFull.addSocialMedia);

export default router;