import { pool } from '../db/index.js';
import bcrypt from 'bcrypt';

const juryUser = {
  email: 'jury@test.fr',
  password: 'Password123!',
  role: 'jury',
  name: 'Jean',
  lastname: 'Selector'
};

async function createJuryUser() {
  try {
    console.log('[CREATE JURY] Debut...\n');

    // Vérifier si l'utilisateur existe déjà
    const [existing] = await pool.execute(
      'SELECT id, email, role FROM user WHERE email = ?',
      [juryUser.email]
    );

    if (existing.length > 0) {
      console.log('[CREATE JURY] Utilisateur existant trouve');
      console.log(`[CREATE JURY] Email: ${existing[0].email}, Role: ${existing[0].role}`);
      console.log('[CREATE JURY] Suppression...');

      await pool.execute('DELETE FROM user WHERE email = ?', [juryUser.email]);
      console.log('[CREATE JURY] Supprime\n');
    }

    // Hasher le mot de passe
    const passwordHash = await bcrypt.hash(juryUser.password, 10);

    // Insérer le nouvel utilisateur
    const [result] = await pool.execute(
      'INSERT INTO user (email, password_hash, role, name, lastname) VALUES (?, ?, ?, ?, ?)',
      [juryUser.email, passwordHash, juryUser.role, juryUser.name, juryUser.lastname]
    );

    console.log('[CREATE JURY] COMPTE CREE !');
    console.log('[CREATE JURY] =====================================');
    console.log(`[CREATE JURY] ID: ${result.insertId}`);
    console.log(`[CREATE JURY] Email: ${juryUser.email}`);
    console.log(`[CREATE JURY] Mot de passe: ${juryUser.password}`);
    console.log(`[CREATE JURY] Role: ${juryUser.role}`);
    console.log(`[CREATE JURY] Nom: ${juryUser.name} ${juryUser.lastname}`);
    console.log('[CREATE JURY] =====================================\n');

    await pool.end();
    console.log('[CREATE JURY] Termine');
  } catch (error) {
    console.error('[CREATE JURY ERROR]', error.message);
    await pool.end();
    process.exit(1);
  }
}

createJuryUser();
