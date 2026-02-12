<<<<<<< HEAD
import { Router } from 'express';
import videoSubmissionController from '../controllers/videoSubmission.controller.js';
import upload from '../middlewares/upload.middleware.js';
import { validateCreateVideo, validateUpdateVideo } from '../../../shared/validators/video.validator.js';
import { sanitizeMiddleware } from '../middlewares/sanitize.middleware.js';
import { validateEditTokenMiddleware } from '../middlewares/validateEditToken.middleware.js';
import { checkAuth } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/requireRole.middleware.js';

const router = Router();

// ========================================
// ROUTES DE SOUMISSION DE VIDÉO
// ========================================

/**
 * POST /api/upload/submit
 * Créer une nouvelle soumission de vidéo avec upload de fichiers
 *
 * Middlewares:
 * 1. upload.videoSubmission - Upload des fichiers (video, cover, srt)
 * 2. upload.attachFileNames - Attache les noms de fichiers au body
 * 3. sanitizeMiddleware - Nettoie les champs texte
 * 4. validateCreateVideo - Valide les données avec Zod
 * 5. createVideo - Controller de création
 */
router.post(
  '/submit',
  upload.videoSubmission,
  upload.attachFileNames,
  sanitizeMiddleware([
    'title',
    'title_en',
    'synopsis',
    'synopsis_en',
    'realisator_name',
    'realisator_lastname',
    'email'
  ]),
  validateCreateVideo,
  videoSubmissionController.createVideo
);

/**
 * PUT /api/upload/:id/update
 * Mettre à jour une vidéo existante avec token de modification
 *
 * Middlewares:
 * 1. validateEditTokenMiddleware - Valide le token JWT (24h, usage unique)
 * 2. upload.videoSubmission - Upload des nouveaux fichiers (optionnels)
 * 3. upload.attachFileNames - Attache les noms de fichiers au body
 * 4. sanitizeMiddleware - Nettoie les champs texte
 * 5. validateUpdateVideo - Valide les données avec Zod
 * 6. updateVideo - Controller de mise à jour
 */
router.put(
  '/:id/update',
  validateEditTokenMiddleware, // ✅ Token validation ajoutée
  upload.videoSubmission,
  upload.attachFileNames,
  sanitizeMiddleware([
    'title',
    'title_en',
    'synopsis',
    'synopsis_en',
    'realisator_name',
    'realisator_lastname',
    'email'
  ]),
  validateUpdateVideo,
  videoSubmissionController.updateVideo
);

/**
 * GET /api/upload/:id
 * Récupérer une vidéo par son ID (accès public)
 */
router.get('/:id', videoSubmissionController.getVideoById);

/**
 * GET /api/upload/:id/validate-token
 * Valider le token d'édition et récupérer les données de la vidéo
 * Utilisé par le frontend pour pré-remplir le formulaire de modification
 *
 * Query params: ?token=eyJhbGci...
 *
 * Response:
 * - 200: Token valide + données vidéo
 * - 403: Token invalide/expiré
 * - 404: Vidéo non trouvée
 */
router.get('/:id/validate-token', validateEditTokenMiddleware, (req, res) => {
  // Le middleware a déjà validé le token et attaché req.editToken
  const video = req.editToken.video;
  const decoded = req.editToken.decoded;

  // Calculer le temps restant
  const { getTokenTimeRemaining } = require('../utils/editToken.util.js');
  const timeLeft = getTokenTimeRemaining(decoded);

  res.status(200).json({
    success: true,
    message: 'Token valide',
    data: {
      video: {
        id: video.id,
        title: video.title,
        title_en: video.title_en,
        synopsis: video.synopsis,
        synopsis_en: video.synopsis_en,
        youtube_url: video.youtube_url,
        video_file_name: video.video_file_name,
        cover: video.cover,
        srt_file_name: video.srt_file_name,
        language: video.language,
        country: video.country,
        duration: video.duration,
        classification: video.classification,
        tech_resume: video.tech_resume,
        creative_resume: video.creative_resume,
        realisator_name: video.realisator_name,
        realisator_lastname: video.realisator_lastname,
        realisator_gender: video.realisator_gender,
        email: video.email,
        birthday: video.birthday,
        mobile_number: video.mobile_number,
        fixe_number: video.fixe_number,
        address: video.address,
        acquisition_source: video.acquisition_source
      },
      token_info: {
        expires_in_hours: timeLeft.hoursLeft,
        expires_in_minutes: timeLeft.minutesLeft,
        can_edit: true
      }
    }
  });
});

// ========================================
// ROUTES ADMIN
// ========================================
=======
import { Router} from 'express';
import { uploadVideo } from '../controllers/video.controller.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = Router();

router.post('/video', upload, uploadVideo);

>>>>>>> origin/yusuf-branch-4

/**
 * POST /api/upload/:id/request-edit
 * Demander une modification au réalisateur (admin only)
 *
 * Génère un token JWT valide 24h et envoie un email au réalisateur
 * avec le lien de modification
 *
 * Middlewares:
 * 1. checkAuth - Vérifie que l'utilisateur est authentifié
 * 2. requireRole('admin', 'superadmin') - Vérifie les permissions
 * 3. requestEdit - Controller qui génère le token et envoie l'email
 *
 * Body (optionnel):
 * {
 *   "reason": "Veuillez modifier le titre et la cover"
 * }
 *
 * Response:
 * - 200: Email envoyé avec succès
 * - 401: Non authentifié
 * - 403: Permissions insuffisantes
 * - 404: Vidéo non trouvée
 * - 500: Erreur envoi email
 */
router.post(
  '/:id/request-edit',
  checkAuth,
  requireRole('admin', 'superadmin'),
  videoSubmissionController.requestEdit
);

export default router;
