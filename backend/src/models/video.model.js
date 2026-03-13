import pool from '../config/db.js';

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
       FROM assignation a
       JOIN video v ON v.id = a.video_id
       WHERE a.user_id = ?
         AND v.id NOT IN (
           SELECT sm.video_id FROM selector_memo sm WHERE sm.user_id = ?
         )
       ORDER BY a.assigned_at DESC, v.created_at DESC`,
      [userId, userId]
    );
    return rows;
  },

  async findAssignedToUser(userId) {
    const [rows] = await pool.execute(
      `SELECT v.id, v.title, v.cover, v.youtube_url, v.video_file_name, v.duration,
              v.classification, v.country, v.synopsis, v.email,
              v.realisator_name, v.realisator_lastname, v.created_at,
              a.assigned_at, sm.statut, sm.rating, sm.comment, sm.updated_at
       FROM assignation a
       JOIN video v ON v.id = a.video_id
       LEFT JOIN selector_memo sm ON sm.video_id = v.id AND sm.user_id = a.user_id
       WHERE a.user_id = ?
       ORDER BY
         CASE WHEN sm.statut IS NULL THEN 0 ELSE 1 END,
         a.assigned_at DESC,
         v.created_at DESC`,
      [userId]
    );
    return rows;
  },

  async findAll({ limit = 24, offset = 0, search = '', classification = '' } = {}) {
    // Sécurise la pagination  => limit entre 1 et 100, offset minimum à 0
    const safeLimit  = Math.min(Math.max(Number(limit)  || 24, 1), 100);
    const safeOffset = Math.max(Number(offset) || 0, 0);

    // Prépare les morceaux de la clause WHERE et leurs paramètres
    const conditions = [];
    const params     = [];

    // Ajoute la recherche texte si un terme est fourni
    if (search) {
      const term = String(search).trim();
      const like = `%${term}%`;

      // Recherche sur =>
      // - titre
      // - prénom/nom du réalisateur
      // - nom complet dans les deux ordres
      // - les tags associés à la vidéo)
      conditions.push(
        `(v.title LIKE ?
          OR v.realisator_name LIKE ?
          OR v.realisator_lastname LIKE ?
          OR CONCAT_WS(' ', v.realisator_name, v.realisator_lastname) LIKE ?
          OR CONCAT_WS(' ', v.realisator_lastname, v.realisator_name) LIKE ?
          OR EXISTS (
            SELECT 1
            FROM video_tag vt2
            JOIN tag t2 ON t2.id = vt2.tag_id
            WHERE vt2.video_id = v.id AND t2.name LIKE ?
          ))`
      );

      // Un paramètres par placeholder "?"
      params.push(like, like, like, like, like, like);
    }

    if (classification && classification !== 'all') {
      conditions.push('v.classification = ?');
      params.push(classification);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    // Nombre total de résultats (pour hasMore)
    const [countRows] = await pool.execute(
      `SELECT COUNT(*) AS total FROM video v ${where}`,
      params
    );
    const total = countRows[0].total;

    // Page courante
    const [rows] = await pool.execute(
      `SELECT v.id, v.title, v.cover, v.youtube_url, v.video_file_name, v.duration,
              v.classification, v.country, v.synopsis, v.language,
              v.realisator_name, v.realisator_lastname, v.created_at
       FROM video v
       ${where}
       ORDER BY v.created_at DESC
       LIMIT ${safeLimit} OFFSET ${safeOffset}`,
      params
    );

    // Tags pour cette page uniquement
    if (rows.length > 0) {
      const videoIds    = rows.map(v => v.id);
      const placeholders = videoIds.map(() => '?').join(',');
      const [tagRows]   = await pool.execute(
        `SELECT vt.video_id, t.id AS tag_id, t.name
         FROM video_tag vt
         JOIN tag t ON t.id = vt.tag_id
         WHERE vt.video_id IN (${placeholders})`,
        videoIds
      );

      const tagsByVideo = {};
      for (const row of tagRows) {
        if (!tagsByVideo[row.video_id]) tagsByVideo[row.video_id] = [];
        tagsByVideo[row.video_id].push({ id: row.tag_id, name: row.name });
      }

      for (const video of rows) {
        video.tags = tagsByVideo[video.id] || [];
      }
    }

    return { rows, total };
  },

  async findById(id) {
    const [rows] = await pool.execute(
      `SELECT * FROM video WHERE id = ?`,
      [id]
    );
    const video = rows[0];
    if (!video) return null;

    // Joindre les tags
    const [tagRows] = await pool.execute(
      `SELECT t.id, t.name
       FROM video_tag vt
       JOIN tag t ON t.id = vt.tag_id
       WHERE vt.video_id = ?`,
      [id]
    );
    video.tags = tagRows;

    // Joindre les reseaux sociaux
    const [socialRows] = await pool.execute(
      `SELECT sm.id, sm.platform, sm.url
       FROM video_social_media vsm
       JOIN social_media sm ON sm.id = vsm.social_media_id
       WHERE vsm.video_id = ?`,
      [id]
    );
    video.social_media = socialRows;

    // Joindre les stills
    const [stillRows] = await pool.execute(
      'SELECT id, file_name, file_url, sort_order FROM still WHERE video_id = ? ORDER BY sort_order ASC',
      [id]
    );
    video.stills = stillRows;

    return video;
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

// nouvelle fonction d'ajout de tags a la vidéo
export const addTagsToVideo = async (videoId, tagIds) => {

  // variable placeholder pour pour ajuster les placeholders dans la requête
  const placeholders = tagIds.map(() => "(?, ?)").join(", ");

  // boucle sur les tagIgs, on ajoute le video et tag id a celuici
  const values = tagIds.flatMap(tagId => [videoId, tagId]);

  // requet prépare
  const query = `INSERT INTO video_tag (video_id, tag_id) VALUES ${placeholders}`;

  // execution de la requete
  const [rows] = await pool.execute(query, values);

  return rows;
};

// fonction pour ajouter les réseaux sociaux à la vidéo
export const addSocialMediaToVideo = async (videoId, socialLinks = []) => {
  if (!Array.isArray(socialLinks) || socialLinks.length === 0) {
    return [];
  }

  const createdLinks = [];

  for (const link of socialLinks) {
    const platform = String(link?.platform || '').trim().toLowerCase();
    const url = String(link?.url || '').trim();

    if (!platform || !url) continue;

    const [socialResult] = await pool.execute(
      `INSERT INTO social_media (platform, url) VALUES (?, ?)`,
      [platform, url]
    );

    const socialMediaId = socialResult.insertId;

    await pool.execute(
      `INSERT INTO video_social_media (video_id, social_media_id) VALUES (?, ?)`,
      [videoId, socialMediaId]
    );

    createdLinks.push({ id: socialMediaId, platform, url });
  }

  return createdLinks;
};

// fonction pour ajouter les contributeurs à la vidéo
export const addContributorsToVideo = async (videoId, contributors = []) => {
  if (!Array.isArray(contributors) || contributors.length === 0) {
    return [];
  }

  // on map le tableau de contributors pour enlever les contributors qui n'ont pas de firstName, lastName, email, productionRole
  const sanitizedContributors = contributors
    .map((contributor) => {
      const firstName = String(contributor?.firstName || "").trim();
      const lastName = String(contributor?.lastName || "").trim();
      const gender = String(contributor?.gender || "").trim().toLowerCase() || null;
      const email = String(contributor?.email || "").trim().toLowerCase();
      const productionRole = String(contributor?.productionRole || "").trim();

      if (!firstName || !lastName || !email || !productionRole) return null;

      return {
        firstName,
        lastName,
        gender,
        email,
        productionRole
      };
    })
    .filter(Boolean);

  if (sanitizedContributors.length === 0) {
    return [];
  }

  // on crée un map pour enlever les contributors qui ont le même email
  const uniqueByEmail = new Map();
  sanitizedContributors.forEach((contributor) => {
    if (!uniqueByEmail.has(contributor.email)) {
      uniqueByEmail.set(contributor.email, contributor);
    }
  });

  const dedupedContributors = Array.from(uniqueByEmail.values());
  const emails = dedupedContributors.map((contributor) => contributor.email);
  const emailPlaceholders = emails.map(() => "?").join(",");

  const [existingRows] = await pool.execute(
    `SELECT email FROM contributor WHERE video_id = ? AND email IN (${emailPlaceholders})`,
    [videoId, ...emails]
  );

  const existingEmails = new Set(
    existingRows.map((row) => String(row.email || "").trim().toLowerCase())
  );

  const contributorsToInsert = dedupedContributors.filter(
    (contributor) => !existingEmails.has(contributor.email)
  );

  if (contributorsToInsert.length === 0) {
    return [];
  }

  // on crée un tableau de valeurs pour les contributeurs à insérer
  const values = contributorsToInsert.flatMap((contributor) => [
    videoId,
    contributor.firstName,
    contributor.lastName,
    contributor.gender,
    contributor.email,
    contributor.productionRole
  ]);
  const rowPlaceholders = contributorsToInsert.map(() => "(?, ?, ?, ?, ?, ?)").join(",");

  await pool.execute(
    `INSERT INTO contributor (video_id, name, last_name, gender, email, production_role) VALUES ${rowPlaceholders}`,
    values
  );

  return contributorsToInsert;
};

// nouvelle fonction d'ajout on test, imax
export const createVideo = async (payload) => {

  // requete preparee
  const query = `
    INSERT INTO video (
      youtube_url, video_file_name, srt_file_name, cover,
      title, title_en, synopsis, synopsis_en, language, country, duration,
      classification, tech_resume, creative_resume,
      realisator_name, realisator_lastname, realisator_gender,
      email, birthday, mobile_number, fixe_number, address, acquisition_source, rights_accepted
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  // valeurs a injecter dans la requete
  const values = [
    payload.youtube_url ?? null,
    payload.video_file_name ?? null,
    payload.srt_file_name ?? null,
    payload.cover ?? null,
    // Keep title optional at API level while satisfying NOT NULL DB schema.
    payload.title ?? '',
    payload.title_en ?? null,
    payload.synopsis ?? null,
    payload.synopsis_en ?? null,
    payload.language ?? null,
    payload.country ?? null,
    payload.duration ?? null,
    payload.classification ?? "hybrid",
    payload.tech_resume ?? null,
    payload.creative_resume ?? null,
    payload.realisator_name ?? null,
    payload.realisator_lastname ?? null,
    payload.realisator_gender ?? null,
    payload.email ?? null,
    payload.birthday ?? null,
    payload.mobile_number ?? null,
    payload.fixe_number ?? null,
    payload.address ?? null,
    payload.acquisition_source ?? null,
    payload.rights_accepted ? 1 : 0
  ];

  // execution de la requete
  const [rows] = await pool.execute(query, values);

  // retourner la vidéo créée
  return rows;
};
