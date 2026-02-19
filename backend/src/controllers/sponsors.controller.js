import pool from '../config/db.js';

const TABLE = 'sponsor';
const URL_PROTOCOL_REGEX = /^https?:\/\//i;
const MAX_SORT_ORDER = 32767;
const MAX_TYPE_CODE = 255;

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
  const raw = Number(value);
  if (!Number.isFinite(raw)) return fallback;
  const normalized = Math.trunc(raw);
  if (normalized < 0) return 0;
  if (normalized > MAX_TYPE_CODE) return MAX_TYPE_CODE;
  return normalized;
};

const parseSortOrder = (value, fallback = 0) => {
  const raw = Number(value);
  if (!Number.isFinite(raw)) return fallback;
  const normalized = Math.trunc(raw);
  if (normalized < 0) return 0;
  if (normalized > MAX_SORT_ORDER) return MAX_SORT_ORDER;
  return normalized;
};

const resolveTypeName = async (typeCode, options = {}) => {
  const { excludeId = null } = options;
  if (!Number.isFinite(Number(typeCode)) || Number(typeCode) <= 0) return '';

  const params = [Number(typeCode)];
  let sql = `
    SELECT name
    FROM ${TABLE}
    WHERE is_active = ?
      AND name IS NOT NULL
      AND TRIM(name) <> ''
  `;

  if (excludeId !== null && excludeId !== undefined) {
    sql += ' AND id <> ?';
    params.push(Number(excludeId));
  }

  sql += ' ORDER BY sort_order ASC, id ASC LIMIT 1';
  const [rows] = await pool.execute(sql, params);
  return rows[0]?.name ? String(rows[0].name).trim() : '';
};

const sponsorSelectWithTypeName = `
  SELECT s.id, s.name, s.img, s.url, s.sort_order, s.is_active,
    (
      SELECT s2.name
      FROM ${TABLE} s2
      WHERE s2.is_active = s.is_active
        AND s2.name IS NOT NULL
        AND TRIM(s2.name) <> ''
      ORDER BY s2.sort_order ASC, s2.id ASC
      LIMIT 1
    ) AS type_name
  FROM ${TABLE} s
`;

export const sponsorsController = {
  async getAll(req, res) {
    try {
      const [rows] = await pool.execute(
        `${sponsorSelectWithTypeName}
         WHERE s.is_active > 0
         ORDER BY s.is_active ASC, s.sort_order ASC, s.id DESC`
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
        `${sponsorSelectWithTypeName}
         ORDER BY s.is_active ASC, s.sort_order ASC, s.id DESC`
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
        `${sponsorSelectWithTypeName}
         WHERE s.id = ? AND s.is_active > 0
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

      const [result] = await pool.execute(
        `INSERT INTO ${TABLE} (name, img, url, sort_order, is_active) VALUES (?, ?, ?, ?, ?)`,
        [nextName, nextImg, nextUrl, nextSortOrder, nextIsActive]
      );

      const [createdRows] = await pool.execute(
        `${sponsorSelectWithTypeName}
         WHERE s.id = ?
         LIMIT 1`,
        [result.insertId]
      );

      return res.status(201).json({
        success: true,
        message: 'Sponsor créé avec succès',
        data: createdRows[0] || {
          id: result.insertId,
          name: nextName,
          img: nextImg,
          url: nextUrl,
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
      const { name, img, url, sort_order, is_active } = req.body;
      const uploadedImg = req.file ? `/uploads/covers/${req.file.filename}` : null;

      const [currentRows] = await pool.execute(
        `SELECT id, name, img, url, sort_order, is_active FROM ${TABLE} WHERE id = ? LIMIT 1`,
        [id]
      );

      if (!currentRows.length) {
        return res.status(404).json({
          success: false,
          message: 'Sponsor introuvable',
        });
      }

      const current = currentRows[0];
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

      const [result] = await pool.execute(
        `UPDATE ${TABLE} SET name = ?, img = ?, url = ?, sort_order = ?, is_active = ? WHERE id = ?`,
        [nextName, nextImg, nextUrl, nextSortOrder, nextIsActive, id]
      );

      if (!result.affectedRows) {
        return res.status(404).json({
          success: false,
          message: 'Sponsor introuvable',
        });
      }

      const [updatedRows] = await pool.execute(
        `${sponsorSelectWithTypeName}
         WHERE s.id = ?
         LIMIT 1`,
        [id]
      );

      return res.json({
        success: true,
        message: 'Sponsor mis à jour avec succès',
        data: updatedRows[0] || {
          id: Number(id),
          name: nextName,
          img: nextImg,
          url: nextUrl,
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

      const [currentRows] = await pool.execute(
        `SELECT id, name FROM ${TABLE} WHERE id = ? LIMIT 1`,
        [id]
      );

      if (!currentRows.length) {
        return res.status(404).json({
          success: false,
          message: 'Sponsor introuvable',
        });
      }

      const current = currentRows[0];
      let nextName = typeof current.name === 'string' ? current.name.trim() : '';
      if (nextIsActive > 0) {
        const inheritedTypeName = await resolveTypeName(nextIsActive, { excludeId: id });
        if (inheritedTypeName) {
          nextName = inheritedTypeName;
        }
      }

      const [result] = await pool.execute(
        `UPDATE ${TABLE} SET is_active = ?, name = ? WHERE id = ?`,
        [nextIsActive, nextName, id]
      );

      if (!result.affectedRows) {
        return res.status(404).json({
          success: false,
          message: 'Sponsor introuvable',
        });
      }

      const [updatedRows] = await pool.execute(
        `${sponsorSelectWithTypeName}
         WHERE s.id = ?
         LIMIT 1`,
        [id]
      );

      return res.json({
        success: true,
        message: 'Type du sponsor mis à jour avec succès',
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
        `SELECT id, is_active, sort_order FROM ${TABLE} WHERE id = ? LIMIT 1`,
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
      const currentType = parseIsActive(current.is_active, 0);

      const [sectionRows] = await connection.execute(
        `SELECT id, sort_order
         FROM ${TABLE}
         WHERE is_active = ?
         ORDER BY sort_order ASC, id ASC`,
        [currentType]
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
        const nextSortOrder = parseSortOrder(index + 1, MAX_SORT_ORDER);
        await connection.execute(
          `UPDATE ${TABLE} SET sort_order = ? WHERE id = ?`,
          [nextSortOrder, row.id]
        );
      }

      await connection.commit();

      const [updatedRows] = await pool.execute(
        `${sponsorSelectWithTypeName}
         WHERE s.id = ?
         LIMIT 1`,
        [id]
      );

      return res.json({
        success: true,
        message: direction === 'up'
          ? 'Sponsor deplace vers le haut'
          : 'Sponsor deplace vers le bas',
        data: updatedRows[0] || { id: Number(id), is_active: currentType },
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

      const [typesRows] = await connection.execute(
        `SELECT is_active AS type_code
         FROM ${TABLE}
         WHERE is_active > 0
         GROUP BY is_active
         ORDER BY type_code ASC`
      );

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
      await connection.execute(
        `UPDATE ${TABLE}
         SET is_active = CASE
           WHEN is_active = ? THEN ?
           WHEN is_active = ? THEN ?
           ELSE is_active
         END
         WHERE is_active IN (?, ?)`,
        [currentType, targetType, targetType, currentType, currentType, targetType]
      );

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
