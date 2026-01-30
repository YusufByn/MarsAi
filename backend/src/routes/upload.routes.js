import { Router} from 'express';
import videoController from '../controllers/video.controller.js';
import  upload  from '../middlewares/upload.middleware.js';

const router = Router();
// const uploadController = require('../controllers/uploadController');

router.post('/videos', 
    ...upload.video,        // Middleware Multer
    videoController.submitVideo  // ← Utiliser submitVideo (pas createVideo)
  );

// router.put('/videos/:id/upload-video', ...upload.video, uploadController.uploadVideoFile);:

// router.put('/videos/:id/upload-cover', ...upload.cover, uploadController.uploadCover);

// router.put('/videos/:id/upload-stills', ...upload.still, uploadController.uploadStills);

// router.put('/videos/:id/upload-subtitles', ...upload.sub, uploadController.uploadSubtitles);

router.post('/videos/:id/contributors', videoController.addContributorsToVideo);

router.post('/videos/:id/social-media', videoController.addSocialMediaToVideo);

export default router;