const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const videoController = require('../controllers/videoController');
const uploadController = require('../controllers/uploadController');

router.post('/videos', videoController.createVideo);

router.put('/videos/:id/upload-video', ...upload.video, uploadController.uploadVideoFile);

router.put('/videos/:id/youtube-url', videoController.addYoutubeUrl);

router.put('/videos/:id/upload-cover', ...upload.cover, uploadController.uploadCover);

router.put('/videos/:id/upload-stills', ...upload.still, uploadController.uploadStills);

router.put('/videos/:id/upload-subtitles', ...upload.sub, uploadController.uploadSubtitles);

router.post('/videos/:id/contributors', videoController.addContributors);

router.post('/videos/:id/social-media', videoController.addSocialMedia);

module.exports = router;