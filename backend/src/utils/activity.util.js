import pool from '../config/db.js';

/**
 * Enregistre une action dans le journal d'activité.
 * Non-bloquant : les erreurs d'insertion ne cassent pas la requête principale.
 *
 * @param {Object} opts
 * @param {string}  opts.action    - Identifiant de l'action (login, register, video_submit, …)
 * @param {number}  [opts.userId]  - ID utilisateur si authentifié
 * @param {string}  [opts.entity]  - Entité concernée (video, user, …)
 * @param {number}  [opts.entityId]
 * @param {string}  [opts.details] - Info complémentaire lisible
 * @param {string}  [opts.ip]
 */
export const logActivity = ({ action, userId = null, entity = null, entityId = null, details = null, ip = null }) => {
  pool.execute(
    'INSERT INTO activity_log (user_id, action, entity, entity_id, details, ip) VALUES (?, ?, ?, ?, ?, ?)',
    [userId ?? null, action, entity ?? null, entityId ?? null, details ?? null, ip ?? null]
  ).catch((err) => {
    console.error('[ACTIVITY LOG] Erreur insertion:', err.message);
  });
};
