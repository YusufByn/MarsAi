import { videoModel } from '../models/video.model.js';

// CRUD de base pour ajouter un video
//Code doublons pour la creation de la video, a determiner si on garde ou non

const buildVideoPayload = (video) => {
  if (!video) return null;
  const fullName = [video.realisator_name, video.realisator_lastname]
    .filter(Boolean)
    .join(' ')
    .trim();

  const payload = {
    ...video,
    author: fullName || null,
    video_url: video.video_file_name ? `/uploads/videos/${video.video_file_name}` : null,
    cover_url: video.cover ? `/uploads/covers/${video.cover}` : null,
  };

  if (Array.isArray(video.stills)) {
    payload.stills = video.stills.map(s => ({
      ...s,
      file_url: s.file_url || (s.file_name ? `/uploads/stills/${s.file_name}` : null),
    }));
  }

  return payload;
};

export const videoPlayerController = {
  async getFeed(req, res, next) {
    try {
      const limit          = Math.min(Math.max(Number(req.query.limit)  || 24, 1), 100);
      const offset         = Math.max(Number(req.query.offset) || 0, 0);
      const search         = req.query.search         ?? '';
      const classification = req.query.classification ?? '';

      const { rows, total } = await videoModel.findAll({ limit, offset, search, classification });

      res.json({
        success: true,
        data: rows.map(buildVideoPayload),
        meta: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const video = await videoModel.findById(id);

      if (!video) {
        return res.status(404).json({
          success: false,
          message: 'Video not found',
        });
      }

      res.json({
        success: true,
        data: buildVideoPayload(video),
      });
    } catch (error) {
      next(error);
    }
  },
};
