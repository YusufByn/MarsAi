import { pool } from '../db/index.js';

export const juryModel = {
  /**
   * Récupérer tous les jurys
   */
  async findAll() {
    const [rows] = await pool.execute(
      'SELECT id, name, lastname, illustration, biographie, created_at FROM jury ORDER BY created_at DESC'
    );
    return rows;
  },

  /**
   * Récupérer un jury par ID
   */
  async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, name, lastname, illustration, biographie, created_at FROM jury WHERE id = ?',
      [id]
    );
    return rows[0];
  },

  /**
   * Créer un nouveau jury
   */
  async create({ name, lastname, illustration, biographie }) {
    const [result] = await pool.execute(
      'INSERT INTO jury (name, lastname, illustration, biographie) VALUES (?, ?, ?, ?)',
      [name, lastname, illustration || null, biographie || null]
    );
    return result.insertId;
  },

  /**
   * Mettre à jour un jury
   */
  async update(id, { name, lastname, illustration, biographie }) {
    const [result] = await pool.execute(
      'UPDATE jury SET name = ?, lastname = ?, illustration = ?, biographie = ? WHERE id = ?',
      [name, lastname, illustration || null, biographie || null, id]
    );
    return result.affectedRows > 0;
  },

  /**
   * Supprimer un jury
   */
  async delete(id) {
    const [result] = await pool.execute('DELETE FROM jury WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};
