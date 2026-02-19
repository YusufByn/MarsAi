import { Router} from 'express';
// import videoController from '../controllers/videoController.js';
import videoController from '../controllers/video.controller.js';
// import uploadController from '../controllers/upload.controller.js';
import  upload  from '../middlewares/upload.middleware.js';
import { apiLimiter } from '../middlewares/rateLimiter.middleware.js';

const router = Router();

router.use(apiLimiter);

// const uploadController = require('../controllers/uploadController');

// router.post(
//     '/videos',
//     ...upload.video,
//     (req, res, next) => {
//       if (req.file) req.body.video_file_name = req.file.filename;
//       next();
//     },
//     videoController.create
//   );

// router.post('/videos', videoController.createVideo);

// router.put('/videos/:id/upload-video', ...upload.video, uploadController.uploadVideoFile);:

// router.put('/videos/:id/upload-cover', ...upload.cover, uploadController.uploadCover);

// router.put('/videos/:id/upload-stills', ...upload.still, uploadController.uploadStills);

// router.put('/videos/:id/upload-subtitles', ...upload.sub, uploadController.uploadSubtitles);

// router.post('/videos/:id/contributors', videoController.addContributors);

// router.post('/videos/:id/social-media', videoController.addSocialMedia);

export default router;