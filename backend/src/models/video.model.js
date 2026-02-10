import { pool } from '../db/index.js';

export const videoModel = {

  /**
   * Recuperer les videos pour le player, en excluant celles deja notees par le selecteur
   * @param {number} userId - ID du selecteur
   * @returns {Promise<Array>} Liste des videos non encore evaluees
   */
  async findForPlayer(userId) {
    const [rows] = await pool.execute(
      `SELECT v.id, v.title, v.title_en, v.synopsis, v.video_file_name, v.cover,
              v.duration, v.classification, v.email, v.realisator_name, v.realisator_lastname
       FROM video v
       WHERE v.id NOT IN (
         SELECT sm.video_id FROM selector_memo sm WHERE sm.user_id = ?
       )
       -- FUTURE: AND v.id IN (SELECT a.video_id FROM assignation a WHERE a.user_id = ?)
       ORDER BY v.created_at DESC`,
      [userId]
    );
    return rows;
  },

  async findAll({ limit = 10 }) {
    const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 50) : 10;
    const [rows] = await pool.execute(
      `SELECT id, title, cover, youtube_url, video_file_name, duration,
              realisator_name, realisator_lastname, created_at
       FROM video
       ORDER BY created_at DESC
       LIMIT ${safeLimit}`
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.execute(
      `SELECT * FROM video WHERE id = ?`,
      [id]
    );
    return rows[0];
  },

  /**
   * Créer une nouvelle vidéo dans la base de données
   * @param {Object} data - Données de la vidéo
   * @returns {Promise<Object>} Vidéo créée avec son ID
   */
  async create(data) {
    const query = `
      INSERT INTO video (
        user_id,
        youtube_url,
        video_file_name,
        srt_file_name,
        cover,
        title,
        title_en,
        synopsis,
        synopsis_en,
        language,
        country,
        duration,
        classification,
        tech_resume,
        creative_resume,
        realisator_name,
        realisator_lastname,
        realisator_gender,
        email,
        birthday,
        mobile_number,
        fixe_number,
        address,
        acquisition_source,
        rights_accepted
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      null, // user_id (NULL par défaut, assigné plus tard par le super admin)
      data.youtube_url || null,
      data.video_file_name || null,
      data.srt_file_name || null,
      data.cover || null,
      data.title,
      data.title_en,
      data.synopsis,
      data.synopsis_en,
      data.language || null,
      data.country || null,
      data.duration || null,
      data.classification,
      data.tech_resume || null,
      data.creative_resume || null,
      data.realisator_name,
      data.realisator_lastname,
      data.realisator_gender,
      data.email,
      data.birthday || null,
      data.mobile_number || null,
      data.fixe_number || null,
      data.address || null,
      data.acquisition_source || null,
      data.rights_accepted ? 1 : 0
    ];

    const [result] = await pool.execute(query, values);

    // Retourner la vidéo créée
    return {
      id: result.insertId,
      ...data,
      user_id: null,
      created_at: new Date()
    };
  },

  /**
   * Mettre à jour une vidéo existante
   * @param {number} id - ID de la vidéo
   * @param {Object} data - Données à mettre à jour
   * @returns {Promise<Object>} Vidéo mise à jour
   */
  async update(id, data) {
    // Construire dynamiquement la requête UPDATE en fonction des champs fournis
    const fields = [];
    const values = [];

    // Liste des champs autorisés à être mis à jour
    const allowedFields = [
      'youtube_url',
      'video_file_name',
      'srt_file_name',
      'cover',
      'title',
      'title_en',
      'synopsis',
      'synopsis_en',
      'language',
      'country',
      'duration',
      'classification',
      'tech_resume',
      'creative_resume',
      'realisator_name',
      'realisator_lastname',
      'realisator_gender',
      'email',
      'birthday',
      'mobile_number',
      'fixe_number',
      'address',
      'acquisition_source'
    ];

    // Ajouter les champs présents dans data
    for (const field of allowedFields) {
      if (data.hasOwnProperty(field)) {
        fields.push(`${field} = ?`);
        values.push(data[field] || null);
      }
    }

    // Si aucun champ à mettre à jour, retourner la vidéo existante
    if (fields.length === 0) {
      return this.findById(id);
    }

    // Ajouter l'ID à la fin des valeurs
    values.push(id);

    const query = `
      UPDATE video
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await pool.execute(query, values);

    // Retourner la vidéo mise à jour
    return this.findById(id);
  },

  /**
   * Assigner un selector (user_id) à une vidéo
   * @param {number} videoId - ID de la vidéo
   * @param {number} userId - ID du selector
   * @returns {Promise<void>}
   */
  async assignSelector(videoId, userId) {
    const query = `UPDATE video SET user_id = ? WHERE id = ?`;
    await pool.execute(query, [userId, videoId]);
  },

  /**
   * Récupérer toutes les vidéos non assignées (user_id NULL)
   * @returns {Promise<Array>} Liste des vidéos non assignées
   */
  async findUnassigned() {
    const [rows] = await pool.execute(
      `SELECT id, title, cover, youtube_url, video_file_name, duration,
              realisator_name, realisator_lastname, created_at
       FROM video
       WHERE user_id IS NULL
       ORDER BY created_at DESC`
    );
    return rows;
  },

  /**
   * Récupérer toutes les vidéos assignées à un selector
   * @param {number} userId - ID du selector
   * @returns {Promise<Array>} Liste des vidéos assignées
   */
  async findBySelector(userId) {
    const [rows] = await pool.execute(
      `SELECT id, title, cover, youtube_url, video_file_name, duration,
              realisator_name, realisator_lastname, created_at
       FROM video
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );
    return rows;
  }
};
