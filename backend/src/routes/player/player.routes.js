import express from 'express';
import playerVideoController from '../../controllers/player/player.controller.js';
import { checkAuth, restrictTo } from '../../middlewares/auth.middleware.js';

const router = express.Router();

const ROLES_PLAYER = ['jury', 'selector', 'admin', 'superadmin'];

// Routes publiques pour le player

// Liste de toutes les vidéos
router.get('/videos', playerVideoController.getVideos.bind(playerVideoController));

// Récupérer une vidéo spécifique par ID
router.get('/videos/:id', playerVideoController.getVideoById.bind(playerVideoController));

// Stream vidéo avec support du range
router.get('/stream/:filename', playerVideoController.streamVideo.bind(playerVideoController));

// Envoi d'email au créateur de la vidéo (jury/selector/admin uniquement)
router.post('/send-email', checkAuth, restrictTo(...ROLES_PLAYER), playerVideoController.sendEmailToCreator.bind(playerVideoController));

// Gestion de la playlist (utilisateur authentifié requis)
router.post('/playlist', checkAuth, playerVideoController.togglePlaylist.bind(playerVideoController));

export default router;
