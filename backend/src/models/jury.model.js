import pool from '../config/db.js'; // Correction du chemin d'import

export const juryModel = {
  async findAll() {
    const [rows] = await pool.execute(
      'SELECT id, name, lastname, illustration, biographie, created_at FROM jury ORDER BY created_at DESC'
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, name, lastname, illustration, biographie, created_at FROM jury WHERE id = ?',
      [id]
    );
    return rows[0];
  },

  async create({ name, lastname, illustration, biographie }) {
    const [result] = await pool.execute(
      'INSERT INTO jury (name, lastname, illustration, biographie) VALUES (?, ?, ?, ?)',
      [name, lastname, illustration || null, biographie || null]
    );
    return result.insertId;
  },

  async update(id, { name, lastname, illustration, biographie }) {
    const [result] = await pool.execute(
      'UPDATE jury SET name = ?, lastname = ?, illustration = ?, biographie = ? WHERE id = ?',
      [name, lastname, illustration || null, biographie || null, id]
    );
    return result.affectedRows > 0;
  },

  async delete(id) {
    const [result] = await pool.execute('DELETE FROM jury WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};