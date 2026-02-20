import pool from '../config/db.js';
import { promises as fs } from 'fs';
import {
  MAX_SORT_ORDER,
  createSponsor,
  deleteSponsor,
  getActiveTypeCodes,
  getAllSponsorsForAdmin,
  getAllVisibleSponsors,
  getOrderContextBySponsorId,
  getSponsorById,
  getSponsorByIdWithTypeName,
  getSponsorsByType,
  getVisibleSponsorById,
  normalizeSponsorUrl,
  parseIsActive,
  parseSortOrder,
  resolveTypeName,
  swapTypeCodes,
  updateSponsor,
  updateSponsorSortOrder,
  updateSponsorVisibility,
} from '../models/sponsors.model.js';

const cleanupUploadedCoverIfAny = async (req, context = 'unknown') => {
  const filePath = req?.file?.path;
  if (!filePath) return;
  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error?.code !== 'ENOENT') {
      console.error(`[SPONSORS] ${context} cleanup upload error:`, error.message);
    }
  }
};

export const sponsorsController = {
  async getAll(req, res) {
    try {
      const rows = await getAllVisibleSponsors();
      return res.json({ success: true, data: rows });
    } catch (error) {
      console.error('[SPONSORS] getAll error:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des sponsors',
      });
    }
  },

  async getAllAdmin(req, res) {
    try {
      const rows = await getAllSponsorsForAdmin();
      return res.json({ success: true, data: rows });
    } catch (error) {
      console.error('[SPONSORS] getAllAdmin error:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des sponsors',
      });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const sponsor = await getVisibleSponsorById(id);

      if (!sponsor) {
        return res.status(404).json({
          success: false,
          message: 'Sponsor introuvable',
        });
      }

      return res.json({ success: true, data: sponsor });
    } catch (error) {
      console.error('[SPONSORS] getById error:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération du sponsor',
      });
    }
  },

  async create(req, res) {
    try {
      const { name = '', img = null, url = null, sort_order = 0, is_active } = req.body;
      const uploadedImg = req.file ? `/uploads/covers/${req.file.filename}` : null;
      const nextImg = uploadedImg || img || null;
      const nextUrl = normalizeSponsorUrl(url);
      const nextSortOrder = parseSortOrder(sort_order, 0);
      const nextIsActive = parseIsActive(is_active, 1);
      const inputName = typeof name === 'string' ? name.trim() : '';
      const inheritedTypeName = !inputName && nextIsActive > 0
        ? await resolveTypeName(nextIsActive)
        : '';
      const nextName = inputName || inheritedTypeName;

      const result = await createSponsor({
        name: nextName,
        img: nextImg,
        url: nextUrl,
        sortOrder: nextSortOrder,
        isActive: nextIsActive,
      });
      const createdSponsor = await getSponsorByIdWithTypeName(result.insertId);

      return res.status(201).json({
        success: true,
        message: 'Sponsor créé avec succès',
        data: createdSponsor || {
          id: result.insertId,
          name: nextName,
          img: nextImg,
          url: nextUrl,
          sort_order: nextSortOrder,
          is_active: nextIsActive,
        },
      });
    } catch (error) {
      await cleanupUploadedCoverIfAny(req, 'create');
      console.error('[SPONSORS] create error:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la création du sponsor',
      });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, img, url, sort_order, is_active } = req.body;
      const uploadedImg = req.file ? `/uploads/covers/${req.file.filename}` : null;

      const current = await getSponsorById(id);

      if (!current) {
        return res.status(404).json({
          success: false,
          message: 'Sponsor introuvable',
        });
      }
      const inputName = name !== undefined
        ? (typeof name === 'string' ? name.trim() : '')
        : undefined;
      const nextImg = uploadedImg || (img !== undefined ? img : current.img);
      const nextUrl = url !== undefined ? normalizeSponsorUrl(url) : current.url;
      const nextSortOrder = sort_order !== undefined
        ? parseSortOrder(sort_order, current.sort_order ?? 0)
        : parseSortOrder(current.sort_order ?? 0, 0);
      const nextIsActive = parseIsActive(is_active, current.is_active ?? 1);
      const typeChanged = Number(nextIsActive) !== Number(parseIsActive(current.is_active, 1));
      let nextName = inputName;

      if (nextName === undefined) {
        nextName = typeChanged ? '' : (typeof current.name === 'string' ? current.name.trim() : '');
      }

      if (!nextName && nextIsActive > 0) {
        const inheritedTypeName = await resolveTypeName(nextIsActive, { excludeId: id });
        nextName = inheritedTypeName || (typeof current.name === 'string' ? current.name.trim() : '');
      }

      const result = await updateSponsor(id, {
        name: nextName,
        img: nextImg,
        url: nextUrl,
        sortOrder: nextSortOrder,
        isActive: nextIsActive,
      });

      if (!result.affectedRows) {
        return res.status(404).json({
          success: false,
          message: 'Sponsor introuvable',
        });
      }

      const updatedSponsor = await getSponsorByIdWithTypeName(id);

      return res.json({
        success: true,
        message: 'Sponsor mis à jour avec succès',
        data: updatedSponsor || {
          id: Number(id),
          name: nextName,
          img: nextImg,
          url: nextUrl,
          sort_order: nextSortOrder,
          is_active: nextIsActive,
        },
      });
    } catch (error) {
      await cleanupUploadedCoverIfAny(req, 'update');
      console.error('[SPONSORS] update error:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour du sponsor',
      });
    }
  },

  async setVisibility(req, res) {
    try {
      const { id } = req.params;
      const { is_active } = req.body;
      const nextIsActive = parseIsActive(is_active, null);

      if (nextIsActive === null) {
        return res.status(400).json({
          success: false,
          message: 'Le champ is_active est obligatoire',
        });
      }

      const current = await getSponsorById(id);

      if (!current) {
        return res.status(404).json({
          success: false,
          message: 'Sponsor introuvable',
        });
      }
      let nextName = typeof current.name === 'string' ? current.name.trim() : '';
      if (nextIsActive > 0) {
        const inheritedTypeName = await resolveTypeName(nextIsActive, { excludeId: id });
        if (inheritedTypeName) {
          nextName = inheritedTypeName;
        }
      }

      const result = await updateSponsorVisibility(id, {
        isActive: nextIsActive,
        name: nextName,
      });

      if (!result.affectedRows) {
        return res.status(404).json({
          success: false,
          message: 'Sponsor introuvable',
        });
      }

      const updatedSponsor = await getSponsorByIdWithTypeName(id);

      return res.json({
        success: true,
        message: 'Type du sponsor mis à jour avec succès',
        data: updatedSponsor || { id: Number(id), is_active: nextIsActive },
      });
    } catch (error) {
      console.error('[SPONSORS] setVisibility error:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour de la visibilité du sponsor',
      });
    }
  },

  async moveOrder(req, res) {
    const connection = await pool.getConnection();
    try {
      const { id } = req.params;
      const direction = String(req.body?.direction || '').trim().toLowerCase();

      if (!['up', 'down'].includes(direction)) {
        return res.status(400).json({
          success: false,
          message: "Le champ direction doit etre 'up' ou 'down'",
        });
      }

      await connection.beginTransaction();

      const current = await getOrderContextBySponsorId(connection, id);

      if (!current) {
        await connection.rollback();
        return res.status(404).json({
          success: false,
          message: 'Sponsor introuvable',
        });
      }

      const currentType = parseIsActive(current.is_active, 0);

      const sectionRows = await getSponsorsByType(connection, currentType);

      const currentIndex = sectionRows.findIndex((row) => Number(row.id) === Number(id));
      if (currentIndex === -1) {
        await connection.rollback();
        return res.status(404).json({
          success: false,
          message: 'Sponsor introuvable',
        });
      }

      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (targetIndex < 0 || targetIndex >= sectionRows.length) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: direction === 'up'
            ? 'Le sponsor est deja en premiere position'
            : 'Le sponsor est deja en derniere position',
        });
      }

      const reordered = [...sectionRows];
      [reordered[currentIndex], reordered[targetIndex]] = [reordered[targetIndex], reordered[currentIndex]];

      for (let index = 0; index < reordered.length; index += 1) {
        const row = reordered[index];
        const nextSortOrder = parseSortOrder(index + 1, MAX_SORT_ORDER);
        await updateSponsorSortOrder(connection, row.id, nextSortOrder);
      }

      await connection.commit();

      const updatedSponsor = await getSponsorByIdWithTypeName(id);

      return res.json({
        success: true,
        message: direction === 'up'
          ? 'Sponsor deplace vers le haut'
          : 'Sponsor deplace vers le bas',
        data: updatedSponsor || { id: Number(id), is_active: currentType },
      });
    } catch (error) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error('[SPONSORS] moveOrder rollback error:', rollbackError.message);
      }
      console.error('[SPONSORS] moveOrder error:', error.message);
      return res.status(500).json({
        success: false,
        message: "Erreur lors du deplacement de l'ordre",
      });
    } finally {
      connection.release();
    }
  },

  async moveTypeOrder(req, res) {
    const connection = await pool.getConnection();
    try {
      const currentType = parseIsActive(req.body?.type, null);
      const direction = String(req.body?.direction || '').trim().toLowerCase();

      if (currentType === null || currentType <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Le champ type doit etre un entier superieur a 0',
        });
      }

      if (!['up', 'down'].includes(direction)) {
        return res.status(400).json({
          success: false,
          message: "Le champ direction doit etre 'up' ou 'down'",
        });
      }

      await connection.beginTransaction();

      const typesRows = await getActiveTypeCodes(connection);

      const currentIndex = typesRows.findIndex((row) => Number(row.type_code) === Number(currentType));
      if (currentIndex === -1) {
        await connection.rollback();
        return res.status(404).json({
          success: false,
          message: 'Type introuvable',
        });
      }

      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (targetIndex < 0 || targetIndex >= typesRows.length) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: direction === 'up'
            ? 'Le type est deja en premiere position'
            : 'Le type est deja en derniere position',
        });
      }

      const reorderedTypes = [...typesRows];
      [reorderedTypes[currentIndex], reorderedTypes[targetIndex]] = [reorderedTypes[targetIndex], reorderedTypes[currentIndex]];
      const targetType = Number(reorderedTypes[currentIndex].type_code);
      await swapTypeCodes(connection, currentType, targetType);

      await connection.commit();

      return res.json({
        success: true,
        message: direction === 'up'
          ? 'Type deplace vers le haut'
          : 'Type deplace vers le bas',
      });
    } catch (error) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error('[SPONSORS] moveTypeOrder rollback error:', rollbackError.message);
      }
      console.error('[SPONSORS] moveTypeOrder error:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors du deplacement du type',
      });
    } finally {
      connection.release();
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await deleteSponsor(id);

      if (!result.affectedRows) {
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
      console.error('[SPONSORS] delete error:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression du sponsor',
      });
    }
  },
};
