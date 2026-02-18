import pool from '../config/db.js';

const TABLE = 'sponsor';
const URL_PROTOCOL_REGEX = /^https?:\/\//i;

const normalizeSponsorUrl = (value) => {
  if (typeof value !== 'string') {
    return value ?? null;
  }

  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return null;
  }

  return URL_PROTOCOL_REGEX.test(trimmedValue) ? trimmedValue : `https://${trimmedValue}`;
};

const parseIsActive = (value, fallback = 1) => {
  if (value === undefined || value === null) return fallback;
  if (typeof value === 'boolean') return value ? 1 : 0;
  if (typeof value === 'number') return value === 1 ? 1 : 0;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['1', 'true', 'yes', 'on'].includes(normalized)) return 1;
    if (['0', 'false', 'no', 'off'].includes(normalized)) return 0;
  }
  return fallback;
};

export const sponsorsController = {
  async getAll(req, res) {
    try {
      const [rows] = await pool.execute(
        `SELECT id, name, img, url, is_active FROM ${TABLE} WHERE is_active = 1 ORDER BY id DESC`
      );
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
      const [rows] = await pool.execute(
        `SELECT id, name, img, url, is_active FROM ${TABLE} ORDER BY id DESC`
      );
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
      const [rows] = await pool.execute(
        `SELECT id, name, img, url, is_active FROM ${TABLE} WHERE id = ? AND is_active = 1 LIMIT 1`,
        [id]
      );

      if (!rows.length) {
        return res.status(404).json({
          success: false,
          message: 'Sponsor introuvable',
        });
      }

      return res.json({ success: true, data: rows[0] });
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
      const { name, img = null, url = null, is_active } = req.body;
      const uploadedImg = req.file ? `/uploads/covers/${req.file.filename}` : null;
      const nextImg = uploadedImg || img || null;
      const nextUrl = normalizeSponsorUrl(url);
      const nextIsActive = parseIsActive(is_active, 1);

      if (!name?.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Le nom du sponsor est obligatoire',
        });
      }

      const [result] = await pool.execute(
        `INSERT INTO ${TABLE} (name, img, url, is_active) VALUES (?, ?, ?, ?)`,
        [name.trim(), nextImg, nextUrl, nextIsActive]
      );

      const [createdRows] = await pool.execute(
        `SELECT id, name, img, url, is_active FROM ${TABLE} WHERE id = ? LIMIT 1`,
        [result.insertId]
      );

      return res.status(201).json({
        success: true,
        message: 'Sponsor créé avec succès',
        data: createdRows[0] || { id: result.insertId, name: name.trim(), img: nextImg, url: nextUrl, is_active: nextIsActive },
      });
    } catch (error) {
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
      const { name, img, url, is_active } = req.body;
      const uploadedImg = req.file ? `/uploads/covers/${req.file.filename}` : null;

      if (!name?.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Le nom du sponsor est obligatoire',
        });
      }

      const [currentRows] = await pool.execute(
        `SELECT id, img, url, is_active FROM ${TABLE} WHERE id = ? LIMIT 1`,
        [id]
      );

      if (!currentRows.length) {
        return res.status(404).json({
          success: false,
          message: 'Sponsor introuvable',
        });
      }

      const current = currentRows[0];
      const nextImg = uploadedImg || (img !== undefined ? img : current.img);
      const nextUrl = url !== undefined ? normalizeSponsorUrl(url) : current.url;
      const nextIsActive = parseIsActive(is_active, current.is_active ?? 1);

      const [result] = await pool.execute(
        `UPDATE ${TABLE} SET name = ?, img = ?, url = ?, is_active = ? WHERE id = ?`,
        [name.trim(), nextImg, nextUrl, nextIsActive, id]
      );

      if (!result.affectedRows) {
        return res.status(404).json({
          success: false,
          message: 'Sponsor introuvable',
        });
      }

      const [updatedRows] = await pool.execute(
        `SELECT id, name, img, url, is_active FROM ${TABLE} WHERE id = ? LIMIT 1`,
        [id]
      );

      return res.json({
        success: true,
        message: 'Sponsor mis à jour avec succès',
        data: updatedRows[0] || { id: Number(id), name: name.trim(), img: nextImg, url: nextUrl, is_active: nextIsActive },
      });
    } catch (error) {
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

      const [result] = await pool.execute(
        `UPDATE ${TABLE} SET is_active = ? WHERE id = ?`,
        [nextIsActive, id]
      );

      if (!result.affectedRows) {
        return res.status(404).json({
          success: false,
          message: 'Sponsor introuvable',
        });
      }

      const [updatedRows] = await pool.execute(
        `SELECT id, name, img, url, is_active FROM ${TABLE} WHERE id = ? LIMIT 1`,
        [id]
      );

      return res.json({
        success: true,
        message: nextIsActive ? 'Sponsor affiché avec succès' : 'Sponsor masqué avec succès',
        data: updatedRows[0] || { id: Number(id), is_active: nextIsActive },
      });
    } catch (error) {
      console.error('[SPONSORS] setVisibility error:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour de la visibilité du sponsor',
      });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const [result] = await pool.execute(`DELETE FROM ${TABLE} WHERE id = ?`, [id]);

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
