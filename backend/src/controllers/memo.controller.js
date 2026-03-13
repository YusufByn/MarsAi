import { memoModel } from '../models/memo.model.js';

// CRUD de base pour ajouter un memo

// ici c'est la qu'on va recup le memo de l'utilisateur pour la video
export const memoController = {
  async getOne(req, res, next) {
    try {
      const { videoId } = req.params;
      const userId = req.user.id;
      const memo = await memoModel.getByUserAndVideo(userId, videoId);

      if (!memo) {
        return res.status(404).json({
          success: false,
          message: 'Memo not found',
        });
      }

      res.json({
        success: true,
        data: memo,
      });
    } catch (error) {
      next(error);
    }
  },

  async getAllByUser(req, res, next) {
    try {
      const userId = req.user.id;
      const memos = await memoModel.getAllByUser(userId);

      res.json({
        success: true,
        data: memos,
      });
    } catch (error) {
      next(error);
    }
  },

  async upsert(req, res, next) {
    try {
      const { video_id, statut, playlist, comment } = req.body;
      const userId = req.user.id;

      const memo = await memoModel.upsertMemo({
        userId,
        videoId: video_id,
        statut,
        playlist,
        comment,
      });

      res.status(201).json({
        success: true,
        message: 'Memo saved',
        data: memo,
      });
    } catch (error) {
      next(error);
    }
  },
};
