import pool from '../config/db.js';

/**
 * Modèle pour gérer les stills (captures d'écran / galerie) des vidéos
 * Table: still
 */

export const stillModel = {
  /**
   * Créer un ou plusieurs stills pour une vidéo
   *
   * @param {number} videoId - ID de la vidéo
   * @param {Array<string>} fileNames - Liste des noms de fichiers
   * @returns {Promise<Array>} Liste des stills créés
   */
  async createMultiple(videoId, fileNames) {
    if (!fileNames || fileNames.length === 0) {
      return [];
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const stills = [];

      for (let i = 0; i < fileNames.length; i++) {
        const [result] = await connection.execute(
          `INSERT INTO still (video_id, file_name, sort_order)
           VALUES (?, ?, ?)`,
          [videoId, fileNames[i], i]
        );

        stills.push({
          id: result.insertId,
          video_id: videoId,
          file_name: fileNames[i],
          sort_order: i
        });
      }

      await connection.commit();
      console.log(`[STILL] ${stills.length} stills créés pour vidéo ${videoId}`);

      return stills;
    } catch (error) {
      await connection.rollback();
      console.error('[STILL ERROR] Erreur création stills:', error);
      throw error;
    } finally {
      connection.release();
    }
  },

  /**
   * Récupérer tous les stills d'une vidéo
   *
   * @param {number} videoId - ID de la vidéo
   * @returns {Promise<Array>} Liste des stills
   */
  async findByVideoId(videoId) {
    try {
      const [rows] = await pool.execute(
        `SELECT * FROM still
         WHERE video_id = ?
         ORDER BY sort_order ASC`,
        [videoId]
      );
      return rows;
    } catch (error) {
      console.error('[STILL ERROR] Erreur récupération stills:', error);
      throw error;
    }
  },

  /**
   * Supprimer tous les stills d'une vidéo
   *
   * @param {number} videoId - ID de la vidéo
   * @returns {Promise<number>} Nombre de stills supprimés
   */
  async deleteByVideoId(videoId) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM still WHERE video_id = ?',
        [videoId]
      );
      console.log(`[STILL] ${result.affectedRows} stills supprimés pour vidéo ${videoId}`);
      return result.affectedRows;
    } catch (error) {
      console.error('[STILL ERROR] Erreur suppression stills:', error);
      throw error;
    }
  },

  /**
   * Supprimer un still spécifique
   *
   * @param {number} stillId - ID du still
   * @returns {Promise<Object>} Still supprimé
   */
  async deleteById(stillId) {
    try {
      // Récupérer le still avant suppression pour retourner ses infos
      const [rows] = await pool.execute(
        'SELECT * FROM still WHERE id = ?',
        [stillId]
      );

      if (rows.length === 0) {
        return null;
      }

      const still = rows[0];

      await pool.execute('DELETE FROM still WHERE id = ?', [stillId]);
      console.log(`[STILL] Still ${stillId} supprimé`);

      return still;
    } catch (error) {
      console.error('[STILL ERROR] Erreur suppression still:', error);
      throw error;
    }
  },

  /**
   * Mettre à jour l'ordre des stills
   *
   * @param {Array<{id: number, sort_order: number}>} updates - Liste des mises à jour
   * @returns {Promise<boolean>}
   */
  async updateSortOrder(updates) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      for (const update of updates) {
        await connection.execute(
          'UPDATE still SET sort_order = ? WHERE id = ?',
          [update.sort_order, update.id]
        );
      }

      await connection.commit();
      console.log(`[STILL] Ordre mis à jour pour ${updates.length} stills`);
      return true;
    } catch (error) {
      await connection.rollback();
      console.error('[STILL ERROR] Erreur mise à jour ordre:', error);
      throw error;
    } finally {
      connection.release();
    }
  }
};

export default stillModel;
