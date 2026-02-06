# 📧 Configuration Newsletter - MarsAI

## Variables d'environnement requises

Ajoute ces variables dans ton fichier `.env` du backend :

```env
# Configuration Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# URL du site web (pour les liens dans les emails)
WEBSITE_URL=http://localhost:5173
```

## Configuration selon le fournisseur d'email

### 📮 Gmail (Recommandé pour dev/staging)
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=votre-email@gmail.com
EMAIL_PASSWORD=votre-app-password
```

**Important**: Pour Gmail, tu dois activer l'authentification à 2 facteurs et générer un "App Password" :
1. Va sur https://myaccount.google.com/security
2. Active la vérification en 2 étapes
3. Génère un mot de passe d'application : https://myaccount.google.com/apppasswords
4. Utilise ce mot de passe dans `EMAIL_PASSWORD`

### 🧪 Mailtrap (Recommandé pour développement)
```env
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-mailtrap-username
EMAIL_PASSWORD=your-mailtrap-password
```

Crée un compte gratuit sur https://mailtrap.io pour tester l'envoi d'emails sans envoyer de vrais emails.

### 🚀 SendGrid (Production)
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=apikey
EMAIL_PASSWORD=votre-sendgrid-api-key
```

### 📬 Brevo (anciennement Sendinblue)
```env
EMAIL_HOST=smtp-relay.brevo.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=votre-email-brevo
EMAIL_PASSWORD=votre-smtp-key
```

## Test de la fonctionnalité

### Backend - Tests unitaires
```bash
cd backend
npm test -- newsletter.test.js
```

### Frontend - Test manuel
1. Démarre le backend : `npm run dev` (port 4000)
2. Démarre le frontend : `npm run dev` (port 5173)
3. Scroll en bas de n'importe quelle page
4. Entre un email dans le formulaire du Footer
5. Vérifie :
   - Message de succès affiché
   - Email reçu dans ta boîte (ou Mailtrap)
   - Inscription en BDD : `SELECT * FROM newsletter;`

## API Endpoints

### S'inscrire
```http
POST http://localhost:4000/api/newsletter/subscribe
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### Se désabonner
```http
POST http://localhost:4000/api/newsletter/unsubscribe
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### Compter les abonnés
```http
GET http://localhost:4000/api/newsletter/count
```

### Liste des abonnés (Admin)
```http
GET http://localhost:4000/api/newsletter
```

## Structure de la table newsletter

```sql
CREATE TABLE `newsletter` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `subscribed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `unsubscribed_at` TIMESTAMP NULL,
  
  INDEX idx_email (`email`)
);
```

## Fichiers créés

### Backend
- `src/models/newsletter.model.js` - Requêtes BDD
- `src/controllers/newsletter.controller.js` - Logique métier
- `src/validators/newsletter.validator.js` - Validation Zod
- `src/services/emailService.js` - Envoi d'emails avec Nodemailer
- `src/routes/newsletter.routes.js` - Routes API
- `src/tests/newsletter.test.js` - Tests unitaires

### Frontend
- `src/services/newsletterService.js` - Service API
- `src/components/layout/Footer.jsx` - Formulaire intégré

## Sécurité

✅ Validation email (Zod + regex)
✅ Protection doublons (vérification BDD)
✅ Rate limiting (déjà configuré dans app.js)
✅ Helmet + CORS activés
✅ Emails normalisés (lowercase + trim)
✅ Réabonnement automatique si désabonné

## Prochaines étapes (optionnel)

- [ ] Ajouter reCAPTCHA v3 pour anti-spam
- [ ] Créer un panneau admin pour envoyer des campagnes
- [ ] Implémenter le double opt-in (email de confirmation)
- [ ] Ajouter des templates d'emails multiples
- [ ] Intégrer un service de marketing automation (Mailchimp, Brevo)

---

🎬 **MarsAI** - Festival International de Cinéma Génératif
