import pool from '../config/db.js';

const TABLE = 'sponsor';
const URL_PROTOCOL_REGEX = /^https?:\/\//i;
const MAX_SORT_ORDER = 32767;
const MAX_TYPE_CODE = 255;

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

export const normalizeSponsorUrl = (value) => {
  if (typeof value !== 'string') {
    return value ?? null;
  }

  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return null;
  }

  return URL_PROTOCOL_REGEX.test(trimmedValue) ? trimmedValue : `https://${trimmedValue}`;
};

export const parseIsActive = (value, fallback = 1) => {
  if (value === undefined || value === null) return fallback;
  const raw = Number(value);
  if (!Number.isFinite(raw)) return fallback;
  const normalized = Math.trunc(raw);
  if (normalized < 0) return 0;
  if (normalized > MAX_TYPE_CODE) return MAX_TYPE_CODE;
  return normalized;
};

export const parseSortOrder = (value, fallback = 0) => {
  const raw = Number(value);
  if (!Number.isFinite(raw)) return fallback;
  const normalized = Math.trunc(raw);
  if (normalized < 0) return 0;
  if (normalized > MAX_SORT_ORDER) return MAX_SORT_ORDER;
  return normalized;
};

export const resolveTypeName = async (typeCode, options = {}) => {
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

export const getAllVisibleSponsors = async () => {
  const [rows] = await pool.execute(
    `${sponsorSelectWithTypeName}
     WHERE s.is_active > 0
     ORDER BY s.is_active ASC, s.sort_order ASC, s.id DESC`
  );
  return rows;
};

export const getAllSponsorsForAdmin = async () => {
  const [rows] = await pool.execute(
    `${sponsorSelectWithTypeName}
     ORDER BY s.is_active ASC, s.sort_order ASC, s.id DESC`
  );
  return rows;
};

export const getVisibleSponsorById = async (id) => {
  const [rows] = await pool.execute(
    `${sponsorSelectWithTypeName}
     WHERE s.id = ? AND s.is_active > 0
     LIMIT 1`,
    [id]
  );
  return rows[0] || null;
};

export const getSponsorByIdWithTypeName = async (id) => {
  const [rows] = await pool.execute(
    `${sponsorSelectWithTypeName}
     WHERE s.id = ?
     LIMIT 1`,
    [id]
  );
  return rows[0] || null;
};

export const getSponsorById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT id, name, img, url, sort_order, is_active FROM ${TABLE} WHERE id = ? LIMIT 1`,
    [id]
  );
  return rows[0] || null;
};

export const createSponsor = async ({ name, img, url, sortOrder, isActive }) => {
  const [result] = await pool.execute(
    `INSERT INTO ${TABLE} (name, img, url, sort_order, is_active) VALUES (?, ?, ?, ?, ?)`,
    [name, img, url, sortOrder, isActive]
  );
  return result;
};

export const updateSponsor = async (id, { name, img, url, sortOrder, isActive }) => {
  const [result] = await pool.execute(
    `UPDATE ${TABLE} SET name = ?, img = ?, url = ?, sort_order = ?, is_active = ? WHERE id = ?`,
    [name, img, url, sortOrder, isActive, id]
  );
  return result;
};

export const updateSponsorVisibility = async (id, { isActive, name }) => {
  const [result] = await pool.execute(
    `UPDATE ${TABLE} SET is_active = ?, name = ? WHERE id = ?`,
    [isActive, name, id]
  );
  return result;
};

export const deleteSponsor = async (id) => {
  const [result] = await pool.execute(`DELETE FROM ${TABLE} WHERE id = ?`, [id]);
  return result;
};

export const getOrderContextBySponsorId = async (connection, id) => {
  const [rows] = await connection.execute(
    `SELECT id, is_active, sort_order FROM ${TABLE} WHERE id = ? LIMIT 1`,
    [id]
  );
  return rows[0] || null;
};

export const getSponsorsByType = async (connection, typeCode) => {
  const [rows] = await connection.execute(
    `SELECT id, sort_order
     FROM ${TABLE}
     WHERE is_active = ?
     ORDER BY sort_order ASC, id ASC`,
    [typeCode]
  );
  return rows;
};

export const updateSponsorSortOrder = async (connection, id, sortOrder) => {
  await connection.execute(
    `UPDATE ${TABLE} SET sort_order = ? WHERE id = ?`,
    [sortOrder, id]
  );
};

export const getActiveTypeCodes = async (connection) => {
  const [rows] = await connection.execute(
    `SELECT is_active AS type_code
     FROM ${TABLE}
     WHERE is_active > 0
     GROUP BY is_active
     ORDER BY type_code ASC`
  );
  return rows;
};

export const swapTypeCodes = async (connection, currentType, targetType) => {
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
};

export { MAX_SORT_ORDER };
