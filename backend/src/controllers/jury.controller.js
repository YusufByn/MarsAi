import { juryModel } from '../models/jury.model.js';

export const juryController = {
  /**
   * GET /api/jury
   * Récupérer tous les jurys
   */
  async getAll(req, res, next) {
    try {
      const jurys = await juryModel.findAll();
      res.json({
        success: true,
        data: jurys
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/jury/:id
   * Récupérer un jury par ID
   */
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const jury = await juryModel.findById(id);

      if (!jury) {
        return res.status(404).json({
          success: false,
          message: 'Jury not found',
        });
      }

      res.json({
        success: true,
        data: jury
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/jury
   * Créer un nouveau jury (superadmin uniquement)
   */
  async create(req, res, next) {
    try {
      const { name, lastname, illustration, biographie } = req.body;
      
      const juryId = await juryModel.create({
        name,
        lastname,
        illustration,
        biographie
      });

      const newJury = await juryModel.findById(juryId);

      res.status(201).json({
        success: true,
        message: 'Jury created successfully',
        data: newJury
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/jury/:id
   * Mettre à jour un jury (superadmin uniquement)
   */
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { name, lastname, illustration, biographie } = req.body;

      const updated = await juryModel.update(id, {
        name,
        lastname,
        illustration,
        biographie
      });

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Jury not found'
        });
      }

      const updatedJury = await juryModel.findById(id);

      res.json({
        success: true,
        message: 'Jury updated successfully',
        data: updatedJury
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /api/jury/:id
   * Supprimer un jury (superadmin uniquement)
   */
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await juryModel.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Jury not found'
        });
      }

      res.json({
        success: true,
        message: 'Jury deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};
