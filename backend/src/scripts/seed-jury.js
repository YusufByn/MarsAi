import { pool } from '../db/index.js';

const jurys = [
  {
    name: 'Spielberg',
    lastname: 'Steven',
    illustration: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    biographie: 'Réalisateur américain légendaire, pionnier du cinéma moderne et de la science-fiction. Connu pour E.T., Jurassic Park et La Liste de Schindler.'
  },
  {
    name: 'Nolan',
    lastname: 'Christopher',
    illustration: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    biographie: 'Maître du cinéma contemporain, réputé pour ses structures narratives complexes et ses explorations du temps. Inception, Interstellar, Oppenheimer.'
  },
  {
    name: 'Villeneuve',
    lastname: 'Denis',
    illustration: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    biographie: 'Cinéaste canadien visionnaire, spécialiste de la science-fiction atmosphérique. Blade Runner 2049, Arrival, Dune.'
  },
  {
    name: 'Anderson',
    lastname: 'Wes',
    illustration: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
    biographie: 'Réalisateur américain reconnu pour son style visuel unique et symétrique. The Grand Budapest Hotel, Moonrise Kingdom, The French Dispatch.'
  },
  {
    name: 'Gerwig',
    lastname: 'Greta',
    illustration: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    biographie: 'Cinéaste américaine, figure emblématique du cinéma indépendant moderne. Lady Bird, Little Women, Barbie.'
  }
];

async function seedJury() {
  try {
    console.log('🌱 Début du seed des jurys...\n');

    for (const jury of jurys) {
      const [result] = await pool.execute(
        'INSERT INTO jury (name, lastname, illustration, biographie) VALUES (?, ?, ?, ?)',
        [jury.name, jury.lastname, jury.illustration, jury.biographie]
      );
      console.log(`✅ Jury créé : ${jury.name} ${jury.lastname} (ID: ${result.insertId})`);
    }

    console.log('\n🎉 Seed terminé avec succès !');
    console.log(`📊 ${jurys.length} jurys ont été créés.\n`);

    // Afficher les jurys créés
    const [rows] = await pool.execute('SELECT id, name, lastname FROM jury ORDER BY id DESC LIMIT 5');
    console.log('📋 Derniers jurys créés :');
    rows.forEach(jury => {
      console.log(`   - ${jury.name} ${jury.lastname} (ID: ${jury.id})`);
    });

    await pool.end();
  } catch (error) {
    console.error('❌ Erreur lors du seed :', error.message);
    await pool.end();
    process.exit(1);
  }
}

seedJury();
