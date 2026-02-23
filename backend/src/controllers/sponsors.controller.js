import { sponsorsModel } from '../models/sponsors.model.js';

const handleSponsorError = (res, error, fallbackMessage, logPrefix) => {
  if (error?.status) {
    return res.status(error.status).json({
      success: false,
      message: error.message,
    });
  }

  console.error(logPrefix, error.message);
  return res.status(500).json({
    success: false,
    message: fallbackMessage,
  });
};

export const sponsorsController = {
  async getAll(req, res) {
    try {
      const rows = await sponsorsModel.getAll();
      return res.json({ success: true, data: rows });
    } catch (error) {
      return handleSponsorError(
        res,
        error,
        'Erreur lors de la récupération des sponsors',
        '[SPONSORS] getAll error:'
      );
    }
  },

  async getAllAdmin(req, res) {
    try {
      const rows = await sponsorsModel.getAllAdmin();
      return res.json({ success: true, data: rows });
    } catch (error) {
      return handleSponsorError(
        res,
        error,
        'Erreur lors de la récupération des sponsors',
        '[SPONSORS] getAllAdmin error:'
      );
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const sponsor = await sponsorsModel.getById(id);

      if (!sponsor) {
        return res.status(404).json({
          success: false,
          message: 'Sponsor introuvable',
        });
      }

      return res.json({ success: true, data: sponsor });
    } catch (error) {
      return handleSponsorError(
        res,
        error,
        'Erreur lors de la récupération du sponsor',
        '[SPONSORS] getById error:'
      );
    }
  },

  async create(req, res) {
    try {
      const created = await sponsorsModel.create(req.body, req.file);
      return res.status(201).json({
        success: true,
        message: 'Sponsor créé avec succès',
        data: created,
      });
    } catch (error) {
      return handleSponsorError(
        res,
        error,
        'Erreur lors de la création du sponsor',
        '[SPONSORS] create error:'
      );
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const updated = await sponsorsModel.update(id, req.body, req.file);
      return res.json({
        success: true,
        message: 'Sponsor mis à jour avec succès',
        data: updated,
      });
    } catch (error) {
      return handleSponsorError(
        res,
        error,
        'Erreur lors de la mise à jour du sponsor',
        '[SPONSORS] update error:'
      );
    }
  },

  async setVisibility(req, res) {
    try {
      const { id } = req.params;
      const { is_visible } = req.body;
      const updated = await sponsorsModel.setVisibility(id, is_visible);
      return res.json({
        success: true,
        message: 'Visibilite du sponsor mise a jour avec succes',
        data: updated,
      });
    } catch (error) {
      return handleSponsorError(
        res,
        error,
        'Erreur lors de la mise à jour de la visibilité du sponsor',
        '[SPONSORS] setVisibility error:'
      );
    }
  },

  async moveOrder(req, res) {
    try {
      const { id } = req.params;
      const { direction } = req.body;
      const result = await sponsorsModel.moveOrder(id, direction);
      return res.json({
        success: true,
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      return handleSponsorError(
        res,
        error,
        "Erreur lors du deplacement de l'ordre",
        '[SPONSORS] moveOrder error:'
      );
    }
  },

  async moveTypeOrder(req, res) {
    try {
      const result = await sponsorsModel.moveTypeOrder(req.body?.type, req.body?.direction);
      return res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      return handleSponsorError(
        res,
        error,
        'Erreur lors du deplacement du type',
        '[SPONSORS] moveTypeOrder error:'
      );
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await sponsorsModel.delete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Sponsor introuvable',
        });
      }

      return res.json({
        success: true,
        message: 'Sponsor supprimé avec succès',
      });
    } catch (error) {
      return handleSponsorError(
        res,
        error,
        'Erreur lors de la suppression du sponsor',
        '[SPONSORS] delete error:'
      );
    }
  },
};
