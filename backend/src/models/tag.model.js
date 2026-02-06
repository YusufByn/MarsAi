import pool from '../config/db.js';

/**
 * Modèle pour gérer les tags et leurs relations avec les vidéos
 * Tables: tag, video_tag
 */

export const tagModel = {
  /**
   * Créer ou récupérer un tag par son nom
   * Si le tag existe déjà, retourne le tag existant
   *
   * @param {string} name - Nom du tag
   * @param {Object} connection - Connection MySQL optionnelle (pour transactions)
   * @returns {Promise<Object>} Tag créé ou existant
   */
  async findOrCreate(name, connection = null) {
    try {
      const trimmedName = name.trim().toLowerCase();
      const executor = connection || pool;

      // Vérifier si le tag existe déjà
      const [existing] = await executor.execute(
        'SELECT * FROM tag WHERE LOWER(name) = ?',
        [trimmedName]
      );

      if (existing.length > 0) {
        console.log(`[TAG] Tag existant récupéré: "${trimmedName}" (ID: ${existing[0].id})`);
        return existing[0];
      }

      // Créer le tag
      const [result] = await executor.execute(
        'INSERT INTO tag (name) VALUES (?)',
        [trimmedName]
      );

      console.log(`[TAG] Tag créé: "${trimmedName}" (ID: ${result.insertId})`);

      return {
        id: result.insertId,
        name: trimmedName
      };
    } catch (error) {
      console.error('[TAG ERROR] Erreur findOrCreate:', error);
      throw error;
    }
  },

  /**
   * Associer des tags à une vidéo
   * Crée les tags s'ils n'existent pas et crée les relations
   *
   * @param {number} videoId - ID de la vidéo
   * @param {Array<string>} tagNames - Liste des noms de tags
   * @returns {Promise<Array>} Liste des tags associés
   */
  async attachToVideo(videoId, tagNames) {
    if (!tagNames || tagNames.length === 0) {
      console.log('[TAG] Aucun tag à associer');
      return [];
    }

    console.log(`[TAG] Tentative d'association de ${tagNames.length} tags pour vidéo ${videoId}:`, tagNames);

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const tags = [];

      for (const tagName of tagNames) {
        console.log(`[TAG] Traitement du tag: "${tagName}"`);

        // Créer ou récupérer le tag (utiliser la connection de la transaction)
        const tag = await tagModel.findOrCreate(tagName, connection);
        console.log(`[TAG] Tag obtenu:`, tag);

        // Vérifier si la relation existe déjà
        const [existing] = await connection.execute(
          'SELECT * FROM video_tag WHERE video_id = ? AND tag_id = ?',
          [videoId, tag.id]
        );

        if (existing.length === 0) {
          // Créer la relation
          await connection.execute(
            'INSERT INTO video_tag (video_id, tag_id) VALUES (?, ?)',
            [videoId, tag.id]
          );
          console.log(`[TAG] Relation créée: video ${videoId} <-> tag ${tag.id}`);
        } else {
          console.log(`[TAG] Relation déjà existante: video ${videoId} <-> tag ${tag.id}`);
        }

        tags.push(tag);
      }

      await connection.commit();
      console.log(`[TAG] ${tags.length} tags associés avec succès à la vidéo ${videoId}`);

      return tags;
    } catch (error) {
      await connection.rollback();
      console.error('[TAG ERROR] Erreur attachToVideo:', error);
      console.error('[TAG ERROR] Stack:', error.stack);
      throw error;
    } finally {
      connection.release();
    }
  },

  /**
   * Récupérer tous les tags d'une vidéo
   *
   * @param {number} videoId - ID de la vidéo
   * @returns {Promise<Array>} Liste des tags
   */
  async findByVideoId(videoId) {
    try {
      const [rows] = await pool.execute(
        `SELECT t.* FROM tag t
         INNER JOIN video_tag vt ON t.id = vt.tag_id
         WHERE vt.video_id = ?
         ORDER BY t.name ASC`,
        [videoId]
      );
      return rows;
    } catch (error) {
      console.error('[TAG ERROR] Erreur findByVideoId:', error);
      throw error;
    }
  },

  /**
   * Supprimer toutes les associations de tags pour une vidéo
   *
   * @param {number} videoId - ID de la vidéo
   * @returns {Promise<number>} Nombre de relations supprimées
   */
  async detachFromVideo(videoId) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM video_tag WHERE video_id = ?',
        [videoId]
      );
      console.log(`[TAG] ${result.affectedRows} tags détachés de la vidéo ${videoId}`);
      return result.affectedRows;
    } catch (error) {
      console.error('[TAG ERROR] Erreur detachFromVideo:', error);
      throw error;
    }
  },

  /**
   * Récupérer tous les tags existants
   *
   * @returns {Promise<Array>} Liste de tous les tags
   */
  async findAll() {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM tag ORDER BY name ASC'
      );
      return rows;
    } catch (error) {
      console.error('[TAG ERROR] Erreur findAll:', error);
      throw error;
    }
  },

  /**
   * Rechercher des tags par nom (pour autocomplete)
   *
   * @param {string} search - Terme de recherche
   * @returns {Promise<Array>} Liste des tags correspondants
   */
  async search(search) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM tag WHERE name LIKE ? ORDER BY name ASC LIMIT 20',
        [`%${search}%`]
      );
      return rows;
    } catch (error) {
      console.error('[TAG ERROR] Erreur search:', error);
      throw error;
    }
  }
};

export default tagModel;
