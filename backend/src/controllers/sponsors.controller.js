import pool from '../config/db.js';

const TABLE = 'sponsor';
const URL_PROTOCOL_REGEX = /^https?:\/\//i;
const MAX_SORT_ORDER = 65535;
const SECTION_ORDER_GAP = 1000;
const ITEM_ORDER_GAP = 10;

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

const normalizeSection = (value, fallback = 'general') => {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  return trimmed || fallback;
};

const parseSortOrder = (value, fallback = 0) => {
  const raw = Number(value);
  if (!Number.isFinite(raw)) return fallback;
  const normalized = Math.trunc(raw);
  if (normalized < 0) return 0;
  if (normalized > MAX_SORT_ORDER) return MAX_SORT_ORDER;
  return normalized;
};

export const sponsorsController = {
  async getAll(req, res) {
    try {
      const [rows] = await pool.execute(
        `SELECT id, name, img, url, section, sort_order, is_active
         FROM ${TABLE}
         WHERE is_active = 1
         ORDER BY
           (SELECT MIN(s2.sort_order) FROM ${TABLE} s2 WHERE s2.section = ${TABLE}.section) ASC,
           section ASC,
           sort_order ASC,
           id DESC`
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
        `SELECT id, name, img, url, section, sort_order, is_active
         FROM ${TABLE}
         ORDER BY
           (SELECT MIN(s2.sort_order) FROM ${TABLE} s2 WHERE s2.section = ${TABLE}.section) ASC,
           section ASC,
           sort_order ASC,
           id DESC`
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
        `SELECT id, name, img, url, section, sort_order, is_active
         FROM ${TABLE}
         WHERE id = ? AND is_active = 1
         LIMIT 1`,
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
      const { name, img = null, url = null, section = 'general', sort_order = 0, is_active } = req.body;
      const uploadedImg = req.file ? `/uploads/covers/${req.file.filename}` : null;
      const nextImg = uploadedImg || img || null;
      const nextUrl = normalizeSponsorUrl(url);
      const nextSection = normalizeSection(section, 'general');
      const nextSortOrder = parseSortOrder(sort_order, 0);
      const nextIsActive = parseIsActive(is_active, 1);

      if (!name?.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Le nom du sponsor est obligatoire',
        });
      }

      const [result] = await pool.execute(
        `INSERT INTO ${TABLE} (name, img, url, section, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?)`,
        [name.trim(), nextImg, nextUrl, nextSection, nextSortOrder, nextIsActive]
      );

      const [createdRows] = await pool.execute(
        `SELECT id, name, img, url, section, sort_order, is_active FROM ${TABLE} WHERE id = ? LIMIT 1`,
        [result.insertId]
      );

      return res.status(201).json({
        success: true,
        message: 'Sponsor créé avec succès',
        data: createdRows[0] || {
          id: result.insertId,
          name: name.trim(),
          img: nextImg,
          url: nextUrl,
          section: nextSection,
          sort_order: nextSortOrder,
          is_active: nextIsActive,
        },
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
      const { name, img, url, section, sort_order, is_active } = req.body;
      const uploadedImg = req.file ? `/uploads/covers/${req.file.filename}` : null;

      if (!name?.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Le nom du sponsor est obligatoire',
        });
      }

      const [currentRows] = await pool.execute(
        `SELECT id, img, url, section, sort_order, is_active FROM ${TABLE} WHERE id = ? LIMIT 1`,
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
      const nextSection = section !== undefined ? normalizeSection(section, 'general') : normalizeSection(current.section, 'general');
      const nextSortOrder = sort_order !== undefined
        ? parseSortOrder(sort_order, current.sort_order ?? 0)
        : parseSortOrder(current.sort_order ?? 0, 0);
      const nextIsActive = parseIsActive(is_active, current.is_active ?? 1);

      const [result] = await pool.execute(
        `UPDATE ${TABLE} SET name = ?, img = ?, url = ?, section = ?, sort_order = ?, is_active = ? WHERE id = ?`,
        [name.trim(), nextImg, nextUrl, nextSection, nextSortOrder, nextIsActive, id]
      );

      if (!result.affectedRows) {
        return res.status(404).json({
          success: false,
          message: 'Sponsor introuvable',
        });
      }

      const [updatedRows] = await pool.execute(
        `SELECT id, name, img, url, section, sort_order, is_active FROM ${TABLE} WHERE id = ? LIMIT 1`,
        [id]
      );

      return res.json({
        success: true,
        message: 'Sponsor mis à jour avec succès',
        data: updatedRows[0] || {
          id: Number(id),
          name: name.trim(),
          img: nextImg,
          url: nextUrl,
          section: nextSection,
          sort_order: nextSortOrder,
          is_active: nextIsActive,
        },
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
        `SELECT id, name, img, url, section, sort_order, is_active FROM ${TABLE} WHERE id = ? LIMIT 1`,
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

  async getSections(req, res) {
    try {
      const [rows] = await pool.execute(
        `SELECT section, COUNT(*) AS sponsors_count, MIN(sort_order) AS section_order
         FROM ${TABLE}
         WHERE section IS NOT NULL AND TRIM(section) <> ''
         GROUP BY section
         ORDER BY section_order ASC, section ASC`
      );

      return res.json({
        success: true,
        data: rows.map((row) => ({
          section: row.section,
          sponsors_count: Number(row.sponsors_count) || 0,
          section_order: Number(row.section_order) || 0,
        })),
      });
    } catch (error) {
      console.error('[SPONSORS] getSections error:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des sections',
      });
    }
  },

  async renameSection(req, res) {
    try {
      const oldSection = normalizeSection(req.body?.old_section, '');
      const newSection = normalizeSection(req.body?.new_section, '');

      if (!oldSection || !newSection) {
        return res.status(400).json({
          success: false,
          message: 'Les champs old_section et new_section sont obligatoires',
        });
      }

      if (oldSection.toLowerCase() === newSection.toLowerCase()) {
        return res.status(400).json({
          success: false,
          message: 'Le nouveau nom de section doit être différent',
        });
      }

      const [result] = await pool.execute(
        `UPDATE ${TABLE} SET section = ? WHERE LOWER(section) = LOWER(?)`,
        [newSection, oldSection]
      );

      return res.json({
        success: true,
        message: 'Section renommée avec succès',
        data: {
          old_section: oldSection,
          new_section: newSection,
          updated_sponsors: result.affectedRows || 0,
        },
      });
    } catch (error) {
      console.error('[SPONSORS] renameSection error:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors du renommage de la section',
      });
    }
  },

  async deleteSection(req, res) {
    try {
      const section = normalizeSection(req.body?.section, '');
      const targetSection = normalizeSection(req.body?.target_section, 'general');

      if (!section) {
        return res.status(400).json({
          success: false,
          message: 'Le champ section est obligatoire',
        });
      }

      if (section.toLowerCase() === targetSection.toLowerCase()) {
        return res.status(400).json({
          success: false,
          message: 'La section cible doit être différente',
        });
      }

      const [result] = await pool.execute(
        `UPDATE ${TABLE} SET section = ? WHERE LOWER(section) = LOWER(?)`,
        [targetSection, section]
      );

      return res.json({
        success: true,
        message: 'Section supprimée avec succès',
        data: {
          deleted_section: section,
          target_section: targetSection,
          updated_sponsors: result.affectedRows || 0,
        },
      });
    } catch (error) {
      console.error('[SPONSORS] deleteSection error:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression de la section',
      });
    }
  },

  async moveSection(req, res) {
    const connection = await pool.getConnection();
    try {
      const section = normalizeSection(req.body?.section, '');
      const direction = String(req.body?.direction || '').trim().toLowerCase();

      if (!section) {
        return res.status(400).json({
          success: false,
          message: 'Le champ section est obligatoire',
        });
      }

      if (!['up', 'down'].includes(direction)) {
        return res.status(400).json({
          success: false,
          message: "Le champ direction doit etre 'up' ou 'down'",
        });
      }

      await connection.beginTransaction();

      const [sectionsRows] = await connection.execute(
        `SELECT section, MIN(sort_order) AS section_order
         FROM ${TABLE}
         WHERE section IS NOT NULL AND TRIM(section) <> ''
         GROUP BY section
         ORDER BY section_order ASC, section ASC`
      );

      const normalizedSection = section.toLowerCase();
      const currentIndex = sectionsRows.findIndex((row) => String(row.section).toLowerCase() === normalizedSection);

      if (currentIndex === -1) {
        await connection.rollback();
        return res.status(404).json({
          success: false,
          message: 'Section introuvable',
        });
      }

      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (targetIndex < 0 || targetIndex >= sectionsRows.length) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: direction === 'up'
            ? 'La section est deja en premiere position'
            : 'La section est deja en derniere position',
        });
      }

      const reorderedSections = [...sectionsRows];
      [reorderedSections[currentIndex], reorderedSections[targetIndex]] = [reorderedSections[targetIndex], reorderedSections[currentIndex]];

      for (let sectionIndex = 0; sectionIndex < reorderedSections.length; sectionIndex += 1) {
        const currentSection = reorderedSections[sectionIndex].section;
        const [sectionSponsors] = await connection.execute(
          `SELECT id
           FROM ${TABLE}
           WHERE section = ?
           ORDER BY sort_order ASC, id ASC`,
          [currentSection]
        );

        for (let itemIndex = 0; itemIndex < sectionSponsors.length; itemIndex += 1) {
          const sponsorId = sectionSponsors[itemIndex].id;
          const nextSortOrder = parseSortOrder(
            sectionIndex * SECTION_ORDER_GAP + (itemIndex + 1) * ITEM_ORDER_GAP,
            MAX_SORT_ORDER
          );
          await connection.execute(
            `UPDATE ${TABLE} SET sort_order = ? WHERE id = ?`,
            [nextSortOrder, sponsorId]
          );
        }
      }

      await connection.commit();

      return res.json({
        success: true,
        message: direction === 'up'
          ? 'Section deplacee vers le haut'
          : 'Section deplacee vers le bas',
      });
    } catch (error) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error('[SPONSORS] moveSection rollback error:', rollbackError.message);
      }
      console.error('[SPONSORS] moveSection error:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors du deplacement de la section',
      });
    } finally {
      connection.release();
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

      const [currentRows] = await connection.execute(
        `SELECT id, section, sort_order FROM ${TABLE} WHERE id = ? LIMIT 1`,
        [id]
      );

      if (!currentRows.length) {
        await connection.rollback();
        return res.status(404).json({
          success: false,
          message: 'Sponsor introuvable',
        });
      }

      const current = currentRows[0];
      const currentSection = normalizeSection(current.section, 'general');

      const [sectionRows] = await connection.execute(
        `SELECT id, sort_order
         FROM ${TABLE}
         WHERE section = ?
         ORDER BY sort_order ASC, id ASC`,
        [currentSection]
      );

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
        const nextSortOrder = parseSortOrder((index + 1) * 10, MAX_SORT_ORDER);
        await connection.execute(
          `UPDATE ${TABLE} SET sort_order = ? WHERE id = ?`,
          [nextSortOrder, row.id]
        );
      }

      await connection.commit();

      const [updatedRows] = await pool.execute(
        `SELECT id, name, img, url, section, sort_order, is_active FROM ${TABLE} WHERE id = ? LIMIT 1`,
        [id]
      );

      return res.json({
        success: true,
        message: direction === 'up'
          ? 'Sponsor deplace vers le haut'
          : 'Sponsor deplace vers le bas',
        data: updatedRows[0] || { id: Number(id), section: currentSection },
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
