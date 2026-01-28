import request from 'supertest';
import app from '../app.js';
import { pool } from '../db/index.js';

describe('Jury API Endpoints', () => {
  let createdJuryId;

  // Données de test
  const testJury = {
    name: 'Dupont',
    lastname: 'Jean',
    illustration: 'https://example.com/photo.jpg',
    biographie: 'Cinéaste reconnu avec 20 ans d\'expérience dans le cinéma d\'auteur.'
  };

  afterAll(async () => {
    // Nettoyer la base de données après les tests
    if (createdJuryId) {
      await pool.execute('DELETE FROM jury WHERE id = ?', [createdJuryId]);
    }
    await pool.end();
  });

  // Test 1: Créer un jury
  describe('POST /api/jury', () => {
    it('devrait créer un nouveau jury', async () => {
      const response = await request(app)
        .post('/api/jury')
        .send(testJury)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe(testJury.name);
      expect(response.body.data.lastname).toBe(testJury.lastname);

      createdJuryId = response.body.data.id;
    });

    it('devrait rejeter une création avec des données invalides', async () => {
      const response = await request(app)
        .post('/api/jury')
        .send({ name: '' }) // Nom vide
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Données invalides');
    });

    it('devrait accepter une création sans illustration ni biographie', async () => {
      const minimalJury = {
        name: 'Martin',
        lastname: 'Sophie'
      };

      const response = await request(app)
        .post('/api/jury')
        .send(minimalJury)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(minimalJury.name);

      // Nettoyer
      await pool.execute('DELETE FROM jury WHERE id = ?', [response.body.data.id]);
    });
  });

  // Test 2: Récupérer tous les jurys
  describe('GET /api/jury', () => {
    it('devrait retourner la liste des jurys', async () => {
      const response = await request(app)
        .get('/api/jury')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  // Test 3: Récupérer un jury par ID
  describe('GET /api/jury/:id', () => {
    it('devrait retourner un jury spécifique', async () => {
      const response = await request(app)
        .get(`/api/jury/${createdJuryId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(createdJuryId);
      expect(response.body.data.name).toBe(testJury.name);
    });

    it('devrait retourner 404 pour un ID inexistant', async () => {
      const response = await request(app)
        .get('/api/jury/999999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Jury non trouvé');
    });

    it('devrait retourner 404 pour un ID invalide', async () => {
      const response = await request(app)
        .get('/api/jury/abc')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  // Test 4: Mettre à jour un jury
  describe('PUT /api/jury/:id', () => {
    it('devrait mettre à jour un jury existant', async () => {
      const updatedData = {
        name: 'Martin',
        lastname: 'Sophie',
        biographie: 'Biographie mise à jour'
      };

      const response = await request(app)
        .put(`/api/jury/${createdJuryId}`)
        .send(updatedData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updatedData.name);
      expect(response.body.data.lastname).toBe(updatedData.lastname);
      expect(response.body.data.biographie).toBe(updatedData.biographie);
    });

    it('devrait retourner 404 pour un ID inexistant', async () => {
      const response = await request(app)
        .put('/api/jury/999999')
        .send({ name: 'Test' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Jury non trouvé');
    });

    it('devrait rejeter une mise à jour avec des données invalides', async () => {
      const response = await request(app)
        .put(`/api/jury/${createdJuryId}`)
        .send({ illustration: 'invalid-url' }) // URL invalide
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('devrait permettre une mise à jour partielle', async () => {
      const response = await request(app)
        .put(`/api/jury/${createdJuryId}`)
        .send({ name: 'NouveauNom' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('NouveauNom');
    });
  });

  // Test 5: Supprimer un jury
  describe('DELETE /api/jury/:id', () => {
    it('devrait retourner 404 pour un ID inexistant', async () => {
      const response = await request(app)
        .delete('/api/jury/999999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Jury non trouvé');
    });

    it('devrait supprimer un jury existant', async () => {
      const response = await request(app)
        .delete(`/api/jury/${createdJuryId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Jury supprimé avec succès');

      // Vérifier que le jury n'existe plus
      const getResponse = await request(app)
        .get(`/api/jury/${createdJuryId}`)
        .expect(404);

      expect(getResponse.body.success).toBe(false);

      createdJuryId = null; // Pour éviter de supprimer deux fois dans afterAll
    });
  });
});
