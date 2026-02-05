import { ratingModel } from '../models/rating.model.js';

export const ratingController = {
  async getOne(req, res, next) {
    try {
      const { userId, videoId } = req.params;
      const rating = await ratingModel.getByUserAndVideo(userId, videoId);

      if (!rating) {
        return res.status(404).json({
          success: false,
          message: 'Rating not found',
        });
      }

      res.json({
        success: true,
        data: rating,
      });
    } catch (error) {
      next(error);
    }
  },

  async upsert(req, res, next) {
    try {
      const { user_id, video_id, rating } = req.body;

      const saved = await ratingModel.upsertRating({
        userId: user_id,
        videoId: video_id,
        rating,
      });

      res.status(201).json({
        success: true,
        message: 'Rating saved',
        data: saved,
      });
    } catch (error) {
      next(error);
    }
  },
};
