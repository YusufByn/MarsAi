import express from 'express';
import playerVideoController from '../../controllers/player/player.controller.js';

const router = express.Router();

// Routes publiques pour le player

// Liste de toutes les vidéos
router.get('/videos', playerVideoController.getVideos.bind(playerVideoController));

// Récupérer une vidéo spécifique par ID
router.get('/videos/:id', playerVideoController.getVideoById.bind(playerVideoController));

// Stream vidéo avec support du range
router.get('/stream/:filename', playerVideoController.streamVideo.bind(playerVideoController));

export default router;
