import pool from '../config/db.js';
import bcrypt from 'bcrypt';

function getAllowedRoles(requestingRole) {
  if (requestingRole === 'superadmin') return ['jury', 'admin'];
  if (requestingRole === 'admin') return ['jury'];
  return [];
}

export const adminUserModel = {

  async findAll(requestingRole) {
    const allowed = getAllowedRoles(requestingRole);
    if (allowed.length === 0) return [];

    const placeholders = allowed.map(() => '?').join(', ');
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const [rows] = await connection.execute(
        `SELECT id, email, role, name, lastname, created_at FROM user WHERE role IN (${placeholders}) ORDER BY created_at DESC`,
        allowed
      );
      await connection.commit();
      return rows;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async create({ email, password, role, name, lastname }, requestingRole) {
    const allowed = getAllowedRoles(requestingRole);
    if (!allowed.includes(role)) {
      throw new Error('Role non autorise');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const [result] = await connection.execute(
        'INSERT INTO user (email, password_hash, role, name, lastname) VALUES (?, ?, ?, ?, ?)',
        [email, passwordHash, role, name, lastname]
      );
      await connection.commit();
      return { id: result.insertId, email, role, name, lastname };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async update(id, { email, role, name, lastname }, requestingRole) {
    const allowed = getAllowedRoles(requestingRole);

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [existing] = await connection.execute(
        'SELECT role FROM user WHERE id = ?',
        [id]
      );
      if (existing.length === 0) throw new Error('Utilisateur introuvable');
      if (!allowed.includes(existing[0].role)) throw new Error('Permission refusee');
      if (role && !allowed.includes(role)) throw new Error('Role non autorise');

      const fields = [];
      const values = [];

      if (email) { fields.push('email = ?'); values.push(email); }
      if (role) { fields.push('role = ?'); values.push(role); }
      if (name) { fields.push('name = ?'); values.push(name); }
      if (lastname) { fields.push('lastname = ?'); values.push(lastname); }

      if (fields.length === 0) {
        await connection.commit();
        return false;
      }

      values.push(id);
      await connection.execute(
        `UPDATE user SET ${fields.join(', ')} WHERE id = ?`,
        values
      );
      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async delete(id, requestingRole) {
    const allowed = getAllowedRoles(requestingRole);

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [existing] = await connection.execute(
        'SELECT role FROM user WHERE id = ?',
        [id]
      );
      if (existing.length === 0) throw new Error('Utilisateur introuvable');
      if (!allowed.includes(existing[0].role)) throw new Error('Permission refusee');

      await connection.execute('DELETE FROM user WHERE id = ?', [id]);
      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
};
