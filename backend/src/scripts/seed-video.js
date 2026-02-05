import { pool } from '../db/index.js';

const seedVideo = async () => {
  try {
    console.log('🌱 Seed video de test...');

    const email = 'realisateur.test@marsai.com';
    await pool.execute(
      'INSERT INTO user (email, password_hash, role, name, lastname) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE email = email',
      [email, null, 'realisateur', 'Test', 'Realisateur']
    );

    const [userRows] = await pool.execute('SELECT id FROM user WHERE email = ? LIMIT 1', [email]);
    const userId = userRows[0]?.id;

    if (!userId) {
      throw new Error('Utilisateur test introuvable');
    }

    const title = 'Film de test - Player';
    const [existing] = await pool.execute('SELECT id FROM video WHERE title = ? LIMIT 1', [title]);
    if (existing.length > 0) {
      console.log(`✅ Video deja presente (ID: ${existing[0].id})`);
      console.log(`👤 User ID: ${userId}`);
      await pool.end();
      return;
    }

    const [result] = await pool.execute(
      `INSERT INTO video (
        user_id, youtube_url, title, synopsis, classification, duration,
        realisator_name, realisator_lastname, email
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        'https://www.youtube.com/watch?v=eq8GccdVg9A',
        title,
        'Video de test pour player + rating + memo.',
        'hybrid',
        120,
        'Test',
        'Realisateur',
        email,
      ]
    );

    console.log(`✅ Video creee (ID: ${result.insertId})`);
    console.log(`👤 User ID: ${userId}`);
    await pool.end();
  } catch (error) {
    console.error('❌ Erreur seed video:', error.message);
    await pool.end();
    process.exit(1);
  }
};

seedVideo();
