import { ratingModel } from '../models/rating.model.js';

// CRUD de base pour ajouter un rating

export const ratingController = {
  async getOne(req, res, next) {
    try {
      const { videoId } = req.params;
      const userId = req.user.id;
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
      const { video_id, rating } = req.body;
      const userId = req.user.id;

      const saved = await ratingModel.upsertRating({
        userId,
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

  async deleteRating(req, res, next) {
    try {
      const { videoId } = req.params;
      const userId = req.user.id;
      await ratingModel.clearRating(userId, videoId);
      res.json({ success: true, message: 'Rating cleared' });
    } catch (error) {
      next(error);
    }
  },
};
