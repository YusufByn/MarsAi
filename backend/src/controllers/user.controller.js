import { userModel } from '../models/user.model.js';

export const userController = {
  /**
   * GET /api/user/:id
   * Récupérer un utilisateur par son ID
   */
  async getById(req, res, next) {
    try {
      
      const { id } = req.params;
      const isOwner = Number(req.user?.id) === Number(id);
      const isAdmin = req.user?.role === 'admin' || req.user?.role === 'superadmin';

      if (!isOwner && !isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to access this resource',
        });
      }

      const user = await userModel.getUserById(id);

      if (!user) {
        return res.status(404).json({
          success: false, 
          message: 'User not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: user,
      });

    } catch (error) {
      next(error);
    }
  },
};
