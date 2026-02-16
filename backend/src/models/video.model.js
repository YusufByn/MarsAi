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
  const query = `
    INSERT INTO video (
      youtube_url, video_file_name, srt_file_name, cover,
      title, title_en, synopsis, synopsis_en, language, country, duration,
      classification, tech_resume, creative_resume,
      realisator_name, realisator_lastname, realisator_gender,
      email, birthday, mobile_number, fixe_number, address, acquisition_source, rights_accepted
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

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

  const [rows] = await pool.execute(query, values);
  return rows;
};
