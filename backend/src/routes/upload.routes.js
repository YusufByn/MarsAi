import { Router} from 'express';
// import videoController from '../controllers/videoController.js';
import videoController from '../controllers/video.controller.js';
// import uploadController from '../controllers/upload.controller.js';
import upload from '../middlewares/upload.middleware.js';
import { verifyRecaptcha } from '../middlewares/recaptcha.middleware.js';
import { submitParticipation } from '../controllers/participation.controller.js';

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

// router.post('/videos/:id/social-media', videoController.addSocialMedia);

// ============================================
// ROUTE DE PARTICIPATION AVEC RECAPTCHA
// ============================================

/**
 * POST /api/upload/participation
 * Soumet une participation vidéo avec vérification reCAPTCHA
 * 
 * Ordre des middlewares :
 * 1. verifyRecaptcha - Vérifie le token reCAPTCHA (bloque les bots)
 * 2. multer - Upload des fichiers (seulement si humain vérifié)
 * 3. submitParticipation - Traite et sauvegarde les données
 */
router.post(
  '/participation',
  verifyRecaptcha,  // ← Vérification reCAPTCHA en premier (économise des ressources)
  // TODO: Ajouter les middlewares multer pour les fichiers quand vous serez prêt
  // Exemple: upload.video[1], upload.cover[1], etc.
  submitParticipation
);

export default router;