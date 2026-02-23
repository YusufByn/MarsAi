import pool from '../config/db.js';

const TABLE = 'sponsor';
const URL_PROTOCOL_REGEX = /^https?:\/\//i;
const MAX_SORT_ORDER = 32767;
const MAX_TYPE_CODE = 255;
const MAX_VISIBILITY = 1;

const SPONSOR_SELECT_WITH_TYPE_NAME = `
  SELECT s.id, s.name, s.img, s.url, s.sort_order, s.is_active, s.is_visible,
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

const httpError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const normalizeUrl = (value) => {
  if (typeof value !== 'string') return value ?? null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  return URL_PROTOCOL_REGEX.test(trimmed) ? trimmed : `https://${trimmed}`;
};

const normalizeType = (value, fallback = 1) => {
  if (value === undefined || value === null) return fallback;

  const raw = Number(value);
  if (!Number.isFinite(raw)) return fallback;

  const normalized = Math.trunc(raw);
  if (normalized < 0) return 0;
  if (normalized > MAX_TYPE_CODE) return MAX_TYPE_CODE;

  return normalized;
};

const normalizeVisibility = (value, fallback = 1) => {
  if (value === undefined || value === null) return fallback;

  const raw = Number(value);
  if (!Number.isFinite(raw)) return fallback;

  const normalized = Math.trunc(raw);
  if (normalized <= 0) return 0;
  if (normalized >= MAX_VISIBILITY) return MAX_VISIBILITY;

  return normalized;
};

const normalizeSortOrder = (value, fallback = 0) => {
  const raw = Number(value);
  if (!Number.isFinite(raw)) return fallback;

  const normalized = Math.trunc(raw);
  if (normalized < 0) return 0;
  if (normalized > MAX_SORT_ORDER) return MAX_SORT_ORDER;

  return normalized;
};

const getOneById = async (id) => {
  const [rows] = await pool.execute(
    `${SPONSOR_SELECT_WITH_TYPE_NAME}
     WHERE s.id = ?
     LIMIT 1`,
    [id]
  );
  return rows[0] || null;
};

const resolveTypeName = async (typeCode, excludeId = null) => {
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

const withTransaction = async (callback) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    try {
      await connection.rollback();
    } catch {
      // noop
    }
    throw error;
  } finally {
    connection.release();
  }
};

export const sponsorsModel = {
  /**
   * Récupérer tous les sponsors visibles (front).
   */
  async getAll() {
    const [rows] = await pool.execute(
      `${SPONSOR_SELECT_WITH_TYPE_NAME}
       WHERE s.is_active > 0 AND s.is_visible = 1
       ORDER BY s.is_active ASC, s.sort_order ASC, s.id ASC`
    );
    return rows;
  },

  /**
   * Récupérer tous les sponsors (admin).
   */
  async getAllAdmin() {
    const [rows] = await pool.execute(
      `${SPONSOR_SELECT_WITH_TYPE_NAME}
       ORDER BY s.is_active ASC, s.sort_order ASC, s.id ASC`
    );
    return rows;
  },

  /**
   * Récupérer un sponsor visible par ID.
   */
  async getById(id) {
    const [rows] = await pool.execute(
      `${SPONSOR_SELECT_WITH_TYPE_NAME}
       WHERE s.id = ? AND s.is_active > 0 AND s.is_visible = 1
       LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  },

  /**
   * Créer un sponsor.
   */
  async create(payload = {}, file = null) {
    const {
      name = '',
      img = null,
      url = null,
      sort_order = 0,
      is_active,
      is_visible,
    } = payload;

    const uploadedImg = file ? `/uploads/covers/${file.filename}` : null;
    const nextImg = uploadedImg || img || null;
    const nextUrl = normalizeUrl(url);
    const nextSortOrder = normalizeSortOrder(sort_order, 0);
    const nextType = normalizeType(is_active, 1);
    const nextVisibility = normalizeVisibility(is_visible, 1);

    const inputName = typeof name === 'string' ? name.trim() : '';
    const inheritedName = !inputName && nextType > 0 ? await resolveTypeName(nextType) : '';
    const nextName = inputName || inheritedName;

    const [result] = await pool.execute(
      `INSERT INTO ${TABLE} (name, img, url, sort_order, is_active, is_visible) VALUES (?, ?, ?, ?, ?, ?)`,
      [nextName, nextImg, nextUrl, nextSortOrder, nextType, nextVisibility]
    );

    return (await getOneById(result.insertId)) || {
      id: result.insertId,
      name: nextName,
      img: nextImg,
      url: nextUrl,
      sort_order: nextSortOrder,
      is_active: nextType,
      is_visible: nextVisibility,
    };
  },

  /**
   * Mettre à jour un sponsor.
   */
  async update(id, payload = {}, file = null) {
    const { name, img, url, sort_order, is_active, is_visible } = payload;
    const uploadedImg = file ? `/uploads/covers/${file.filename}` : null;

    const [currentRows] = await pool.execute(
      `SELECT id, name, img, url, sort_order, is_active, is_visible FROM ${TABLE} WHERE id = ? LIMIT 1`,
      [id]
    );

    if (!currentRows.length) throw httpError(404, 'Sponsor introuvable');

    const current = currentRows[0];
    const nextType = normalizeType(is_active, current.is_active ?? 1);

    const inputName = name !== undefined ? (typeof name === 'string' ? name.trim() : '') : undefined;
    const typeChanged = Number(nextType) !== Number(normalizeType(current.is_active, 1));

    let nextName = inputName;
    if (nextName === undefined) {
      nextName = typeChanged ? '' : (typeof current.name === 'string' ? current.name.trim() : '');
    }
    if (!nextName && nextType > 0) {
      const inheritedName = await resolveTypeName(nextType, id);
      nextName = inheritedName || (typeof current.name === 'string' ? current.name.trim() : '');
    }

    const nextImg = uploadedImg || (img !== undefined ? img : current.img);
    const nextUrl = url !== undefined ? normalizeUrl(url) : current.url;
    const nextVisibility = is_visible !== undefined
      ? normalizeVisibility(is_visible, current.is_visible ?? 1)
      : normalizeVisibility(current.is_visible ?? 1, 1);
    const nextSortOrder = sort_order !== undefined
      ? normalizeSortOrder(sort_order, current.sort_order ?? 0)
      : normalizeSortOrder(current.sort_order ?? 0, 0);

    await pool.execute(
      `UPDATE ${TABLE} SET name = ?, img = ?, url = ?, sort_order = ?, is_active = ?, is_visible = ? WHERE id = ?`,
      [nextName, nextImg, nextUrl, nextSortOrder, nextType, nextVisibility, id]
    );

    return (await getOneById(id)) || {
      id: Number(id),
      name: nextName,
      img: nextImg,
      url: nextUrl,
      sort_order: nextSortOrder,
      is_active: nextType,
      is_visible: nextVisibility,
    };
  },

  /**
   * Changer la visibilite (is_visible) d'un sponsor.
   */
  async setVisibility(id, isVisibleValue) {
    const nextVisibility = normalizeVisibility(isVisibleValue, null);
    if (nextVisibility === null) throw httpError(400, 'Le champ is_visible est obligatoire');

    const [currentRows] = await pool.execute(
      `SELECT id FROM ${TABLE} WHERE id = ? LIMIT 1`,
      [id]
    );
    if (!currentRows.length) throw httpError(404, 'Sponsor introuvable');

    await pool.execute(
      `UPDATE ${TABLE} SET is_visible = ? WHERE id = ?`,
      [nextVisibility, id]
    );

    return (await getOneById(id)) || { id: Number(id), is_visible: nextVisibility };
  },

  /**
   * Déplacer un sponsor dans l'ordre de sa section.
   */
  async moveOrder(id, directionValue) {
    const direction = String(directionValue || '').trim().toLowerCase();
    if (!['up', 'down'].includes(direction)) {
      throw httpError(400, "Le champ direction doit etre 'up' ou 'down'");
    }

    const result = await withTransaction(async (connection) => {
      const [currentRows] = await connection.execute(
        `SELECT id, is_active, sort_order FROM ${TABLE} WHERE id = ? LIMIT 1`,
        [id]
      );
      if (!currentRows.length) throw httpError(404, 'Sponsor introuvable');

      const current = currentRows[0];
      const currentType = normalizeType(current.is_active, 0);

      const [sectionRows] = await connection.execute(
        `SELECT id, sort_order
         FROM ${TABLE}
         WHERE is_active = ?
         ORDER BY sort_order ASC, id ASC`,
        [currentType]
      );

      const currentIndex = sectionRows.findIndex((row) => Number(row.id) === Number(id));
      if (currentIndex === -1) throw httpError(404, 'Sponsor introuvable');

      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (targetIndex < 0 || targetIndex >= sectionRows.length) {
        throw httpError(
          400,
          direction === 'up'
            ? 'Le sponsor est deja en premiere position'
            : 'Le sponsor est deja en derniere position'
        );
      }

      const reordered = [...sectionRows];
      [reordered[currentIndex], reordered[targetIndex]] = [reordered[targetIndex], reordered[currentIndex]];

      for (let i = 0; i < reordered.length; i += 1) {
        const row = reordered[i];
        const nextSortOrder = normalizeSortOrder(i + 1, MAX_SORT_ORDER);
        await connection.execute(`UPDATE ${TABLE} SET sort_order = ? WHERE id = ?`, [nextSortOrder, row.id]);
      }

      const updated = await getOneById(id);
      return {
        currentType,
        updated,
      };
    });

    return {
      message: direction === 'up' ? 'Sponsor deplace vers le haut' : 'Sponsor deplace vers le bas',
      data: result.updated || { id: Number(id), is_active: result.currentType },
    };
  },

  /**
   * Déplacer un type (is_active) vers le haut/bas.
   */
  async moveTypeOrder(typeValue, directionValue) {
    const currentType = normalizeType(typeValue, null);
    const direction = String(directionValue || '').trim().toLowerCase();

    if (currentType === null || currentType <= 0) {
      throw httpError(400, 'Le champ type doit etre un entier superieur a 0');
    }
    if (!['up', 'down'].includes(direction)) {
      throw httpError(400, "Le champ direction doit etre 'up' ou 'down'");
    }

    await withTransaction(async (connection) => {
      const [typesRows] = await connection.execute(
        `SELECT is_active AS type_code
         FROM ${TABLE}
         WHERE is_active > 0
         GROUP BY is_active
         ORDER BY type_code ASC`
      );

      const currentIndex = typesRows.findIndex((row) => Number(row.type_code) === Number(currentType));
      if (currentIndex === -1) throw httpError(404, 'Type introuvable');

      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (targetIndex < 0 || targetIndex >= typesRows.length) {
        throw httpError(
          400,
          direction === 'up' ? 'Le type est deja en premiere position' : 'Le type est deja en derniere position'
        );
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
    });

    return {
      message: direction === 'up' ? 'Type deplace vers le haut' : 'Type deplace vers le bas',
    };
  },

  /**
   * Supprimer un sponsor.
   */
  async delete(id) {
    const [result] = await pool.execute(`DELETE FROM ${TABLE} WHERE id = ?`, [id]);
    return result.affectedRows > 0;
  },
};
