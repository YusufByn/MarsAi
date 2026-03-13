import { userModel } from '../models/user.model.js';

export const userController = {
  /**
   * GET /api/user/:id
   * Récupérer un utilisateur par son ID
   */
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await userModel.getUserById(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },
};
