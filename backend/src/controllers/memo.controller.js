import { memoModel } from '../models/memo.model.js';

// CRUD de base pour ajouter un memo

// ici c'est la qu'on va recup le memo de l'utilisateur pour la video
export const memoController = {
  async getOne(req, res, next) {
    try {
      const { userId, videoId } = req.params;
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

  // ici c'est la qu'on va recup tous les memos de l'utilisateur
  async getAllByUser(req, res, next) {
    try {
      const { userId } = req.params;
      const memos = await memoModel.getAllByUser(userId);

      res.json({
        success: true,
        data: memos,
      });
    } catch (error) {
      next(error);
    }
  },

  // ici c'est la qu'on va enregistrer le memo de l'utilisateur pour la video
  async upsert(req, res, next) {
    try {
      const { user_id, video_id, statut, playlist, comment } = req.body;

      const memo = await memoModel.upsertMemo({
        userId: user_id,
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
