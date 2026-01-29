import request from 'supertest';
import app from '../app.js';
import { pool } from '../db/index.js';

describe('Newsletter API', () => {
  const testEmail = `test-${Date.now()}@example.com`;
  const testEmail2 = `test2-${Date.now()}@example.com`;

  // Nettoyer les emails de test avant chaque série de tests
  beforeAll(async () => {
    await pool.query('DELETE FROM newsletter WHERE email LIKE ?', ['test-%@example.com']);
  });

  // Nettoyer après tous les tests
  afterAll(async () => {
    await pool.query('DELETE FROM newsletter WHERE email LIKE ?', ['test-%@example.com']);
    await pool.end();
  });

  describe('POST /api/newsletter/subscribe', () => {
    it('devrait créer une nouvelle inscription avec un email valide', async () => {
      const res = await request(app)
        .post('/api/newsletter/subscribe')
        .send({ email: testEmail })
        .expect('Content-Type', /json/)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('Inscription réussie');
      expect(res.body.data.email).toBe(testEmail);
    });

    it('devrait retourner une erreur 409 si l\'email est déjà inscrit', async () => {
      // Première inscription
      await request(app)
        .post('/api/newsletter/subscribe')
        .send({ email: testEmail2 });

      // Deuxième inscription (doublon)
      const res = await request(app)
        .post('/api/newsletter/subscribe')
        .send({ email: testEmail2 })
        .expect('Content-Type', /json/)
        .expect(409);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('déjà inscrit');
    });

    it('devrait retourner une erreur 400 si l\'email est invalide', async () => {
      const res = await request(app)
        .post('/api/newsletter/subscribe')
        .send({ email: 'not-an-email' })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Validation échouée');
    });

    it('devrait retourner une erreur 400 si l\'email est manquant', async () => {
      const res = await request(app)
        .post('/api/newsletter/subscribe')
        .send({})
        .expect('Content-Type', /json/)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Validation échouée');
    });

    it('devrait normaliser l\'email (lowercase + trim)', async () => {
      const unnormalizedEmail = `TEST-UPPERCASE-${Date.now()}@EXAMPLE.COM`;
      const normalizedEmail = unnormalizedEmail.toLowerCase();

      const res = await request(app)
        .post('/api/newsletter/subscribe')
        .send({ email: unnormalizedEmail })
        .expect(201);

      expect(res.body.data.email).toBe(normalizedEmail);

      // Cleanup
      await pool.query('DELETE FROM newsletter WHERE email = ?', [normalizedEmail]);
    });

    it('devrait réabonner un email qui s\'était désabonné', async () => {
      const resubEmail = `resub-${Date.now()}@example.com`;

      // 1. Inscription initiale
      await request(app)
        .post('/api/newsletter/subscribe')
        .send({ email: resubEmail });

      // 2. Désabonnement
      await request(app)
        .post('/api/newsletter/unsubscribe')
        .send({ email: resubEmail });

      // 3. Réabonnement
      const res = await request(app)
        .post('/api/newsletter/subscribe')
        .send({ email: resubEmail })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('Réinscription réussie');

      // Vérifier que unsubscribed_at est NULL
      const [rows] = await pool.query('SELECT * FROM newsletter WHERE email = ?', [resubEmail]);
      expect(rows[0].unsubscribed_at).toBeNull();

      // Cleanup
      await pool.query('DELETE FROM newsletter WHERE email = ?', [resubEmail]);
    });
  });

  describe('POST /api/newsletter/unsubscribe', () => {
    const unsubEmail = `unsub-${Date.now()}@example.com`;

    beforeAll(async () => {
      // Créer un abonné pour tester le désabonnement
      await request(app)
        .post('/api/newsletter/subscribe')
        .send({ email: unsubEmail });
    });

    it('devrait désabonner un email existant', async () => {
      const res = await request(app)
        .post('/api/newsletter/unsubscribe')
        .send({ email: unsubEmail })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain('Désinscription réussie');

      // Vérifier que unsubscribed_at est rempli
      const [rows] = await pool.query('SELECT * FROM newsletter WHERE email = ?', [unsubEmail]);
      expect(rows[0].unsubscribed_at).not.toBeNull();
    });

    it('devrait retourner 404 si l\'email n\'existe pas', async () => {
      const res = await request(app)
        .post('/api/newsletter/unsubscribe')
        .send({ email: 'nonexistent@example.com' })
        .expect('Content-Type', /json/)
        .expect(404);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('n\'est pas inscrit');
    });

    it('devrait retourner 400 si l\'email est déjà désabonné', async () => {
      const res = await request(app)
        .post('/api/newsletter/unsubscribe')
        .send({ email: unsubEmail })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('déjà désabonné');
    });
  });

  describe('GET /api/newsletter/count', () => {
    it('devrait retourner le nombre d\'abonnés actifs', async () => {
      const res = await request(app)
        .get('/api/newsletter/count')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('count');
      expect(typeof res.body.data.count).toBe('number');
    });
  });

  describe('GET /api/newsletter', () => {
    it('devrait retourner la liste de tous les abonnés actifs', async () => {
      const res = await request(app)
        .get('/api/newsletter')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('count');
      expect(res.body.data).toHaveProperty('subscribers');
      expect(Array.isArray(res.body.data.subscribers)).toBe(true);
    });

    it('devrait ne retourner que les abonnés actifs (non désabonnés)', async () => {
      const res = await request(app)
        .get('/api/newsletter')
        .expect(200);

      const subscribers = res.body.data.subscribers;
      
      // Vérifier qu'aucun abonné n'a de unsubscribed_at rempli
      const hasUnsubscribed = subscribers.some(sub => sub.unsubscribed_at !== null);
      expect(hasUnsubscribed).toBe(false);
    });
  });

  describe('Validation des emails', () => {
    it('devrait rejeter un email trop court', async () => {
      const res = await request(app)
        .post('/api/newsletter/subscribe')
        .send({ email: 'a@b' })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('devrait rejeter un email trop long', async () => {
      const longEmail = 'a'.repeat(250) + '@example.com';
      const res = await request(app)
        .post('/api/newsletter/subscribe')
        .send({ email: longEmail })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('devrait accepter des emails avec des caractères spéciaux valides', async () => {
      const specialEmail = `test.user+tag${Date.now()}@example.com`;
      const res = await request(app)
        .post('/api/newsletter/subscribe')
        .send({ email: specialEmail })
        .expect(201);

      expect(res.body.success).toBe(true);

      // Cleanup
      await pool.query('DELETE FROM newsletter WHERE email = ?', [specialEmail]);
    });
  });
});
