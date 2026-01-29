# 📧 Guide Admin Newsletter - MarsAI

## ✅ Système Implémenté (Version Simple)

### 🎯 Fonctionnalités

#### **Backend**
- ✅ Envoi en masse avec `beginTransaction()` / `commit()`
- ✅ Sélection multi-destinataires (Newsletter, Réalisateurs, Sélectionneurs, Jury)
- ✅ Aperçu en temps réel du nombre de destinataires
- ✅ Validation Zod (sujet min 5 car., message min 20 car.)
- ✅ Limite d'envoi : 2 newsletters/jour
- ✅ Template HTML personnalisable (Glassmorphism MarsAI)
- ✅ Gestion des erreurs (compteur success/failed)
- ✅ Déduplication automatique des emails

#### **Frontend**
- ✅ Composant React Glassmorphism
- ✅ Formulaire avec validation
- ✅ Checkboxes multi-sélection destinataires
- ✅ Compteur en temps réel par type
- ✅ Modal de confirmation avant envoi
- ✅ Feedback succès/échec avec auto-reset
- ✅ États de chargement

---

## 🚀 Utilisation

### **1. Accéder à l'interface**

#### Option A : Composant standalone (pour tester)
Ajoute cette route temporaire dans `App.jsx` :

```jsx
import NewsletterAdmin from './pages/admin/NewsletterAdmin';

// Dans tes routes
<Route path="/admin/newsletter" element={<NewsletterAdmin />} />
```

Puis accède à : **http://localhost:5173/admin/newsletter**

#### Option B : Intégrer dans le dashboard admin (futur)
Ton collègue pourra importer le composant :

```jsx
import NewsletterAdmin from '../pages/admin/NewsletterAdmin';

// Dans le dashboard admin
<NewsletterAdmin />
```

---

### **2. Créer une Newsletter**

1. **Remplis le sujet** (min. 5 caractères)
2. **Rédige le message** (min. 20 caractères, retours à la ligne supportés)
3. **Sélectionne les destinataires** :
   - ☑️ **Newsletter** : Abonnés actifs (table `newsletter`)
   - ☑️ **Réalisateurs** : Emails des films soumis (table `video`)
   - ☑️ **Sélectionneurs** : Admins et Superadmins (table `user` role admin/superadmin)
   - ☑️ **Jury** : Membres du jury (table `user` role jury)
4. **Vérifie le compteur** : Le nombre total s'affiche automatiquement
5. **Clique sur "Envoyer la Newsletter"**
6. **Confirme dans la modal** : Aperçu de la répartition
7. **Attends la confirmation** : "Campagne envoyée avec succès"

---

## 📊 API Endpoints

### **Aperçu Destinataires**
```http
POST http://localhost:4000/api/newsletter/campaign/preview
Content-Type: application/json

{
  "recipients": ["newsletter", "realisateurs"]
}

// Response
{
  "success": true,
  "data": {
    "total": 150,
    "breakdown": {
      "newsletter": 100,
      "realisateurs": 50,
      "selectionneurs": 0,
      "jury": 0
    }
  }
}
```

### **Envoyer Campagne**
```http
POST http://localhost:4000/api/newsletter/campaign/send
Content-Type: application/json

{
  "subject": "🎬 Annonce : Ouverture des soumissions MarsAI 2026",
  "message": "Bonjour,\n\nNous sommes ravis de vous annoncer l'ouverture des soumissions pour le festival MarsAI 2026.\n\nRendez-vous sur notre site pour soumettre votre film !",
  "recipients": ["newsletter", "realisateurs"]
}

// Response
{
  "success": true,
  "message": "Campagne envoyée avec succès à 148 destinataires",
  "data": {
    "totalSent": 150,
    "successful": 148,
    "failed": 2,
    "recipients": {
      "newsletter": 100,
      "realisateurs": 50
    }
  }
}
```

---

## 🗄️ Structure Base de Données

### **Sources de Destinataires**

| Type | Table Source | Champ Email | Filtre |
|------|-------------|-------------|--------|
| Newsletter | `newsletter` | `email` | `unsubscribed_at IS NULL` |
| Réalisateurs | `video` | `email` | `email IS NOT NULL AND email != ""` |
| Sélectionneurs | `user` | `email` | `role = 'admin' OR role = 'superadmin'` |
| Jury | `user` | `email` | `role = 'jury'` |

---

## 🔒 Sécurité

### **1. Limite d'Envoi**
- **Max 2 newsletters/jour** (vérification via `countCampaignsToday()`)
- Error 429 si limite atteinte : `"Limite d'envoi atteinte : maximum 2 newsletters par jour"`

### **2. Validation**
- **Sujet** : 5-255 caractères
- **Message** : 20-10 000 caractères
- **Destinataires** : Au moins 1 type sélectionné

### **3. Transaction SQL**
```javascript
const connection = await pool.getConnection();
await connection.beginTransaction();
// ... envoi emails ...
await connection.commit();
connection.release();
```

### **4. Déduplication**
Les emails sont automatiquement dédupliqués si une personne est présente dans plusieurs listes.

---

## 🎨 Template Email

Le template HTML est personnalisable dans `emailService.js` :

```javascript
generateCustomEmailHTML(subject, message, email)
```

**Rendu actuel** :
- Logo MarsAI avec gradient
- Sujet en grand (H1)
- Message avec retours à la ligne (`\n` → `<br>`)
- Footer avec liens de désabonnement
- Design Glassmorphism cohérent avec le site

---

## 🚧 Évolution Futur (Phase 2)

### **Historique des Campagnes**
Créer la table `newsletter_campaign` :

```sql
CREATE TABLE `newsletter_campaign` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `subject` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `recipients_types` JSON COMMENT '["newsletter", "realisateurs"]',
  `total_sent` INT UNSIGNED DEFAULT 0,
  `successful` INT UNSIGNED DEFAULT 0,
  `failed` INT UNSIGNED DEFAULT 0,
  `created_by` INT UNSIGNED NOT NULL,
  `sent_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_sent_at (`sent_at`),
  
  CONSTRAINT fk_campaign_user FOREIGN KEY (`created_by`) 
    REFERENCES `user`(`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Fonctionnalités futures** :
- [ ] Sauvegarde historique des campagnes
- [ ] Dashboard statistiques (nombre d'envois, taux de succès)
- [ ] Programmation d'envoi (`scheduled_at`)
- [ ] Rich Text Editor (Quill, TinyMCE, Tiptap)
- [ ] Templates réutilisables
- [ ] Envoi récurrent (cron job avec `node-cron`)
- [ ] Tracking (taux d'ouverture, clics)
- [ ] Middleware auth admin (JWT)

---

## 🧪 Tests

### **Backend - Tests Unitaires**
```bash
cd backend
npm test -- newsletter.test.js
```

### **Frontend - Test Manuel**
1. Démarre le backend : `npm run dev` (port 4000)
2. Démarre le frontend : `npm run dev` (port 5173)
3. Accède à http://localhost:5173/admin/newsletter
4. Teste l'envoi avec tes propres emails

### **Vérifier les Emails**
- **Gmail** : Vérifie ta boîte mail
- **Mailtrap** : https://mailtrap.io → Inboxes

---

## 🐛 Dépannage

### **Erreur : "Limite d'envoi atteinte"**
➡️ Tu as déjà envoyé 2 newsletters aujourd'hui. Attends demain ou modifie la limite dans `newsletterController.sendCampaign()`.

### **Erreur : "Aucun destinataire trouvé"**
➡️ Vérifie que tu as des données dans les tables sources :
```sql
SELECT COUNT(*) FROM newsletter WHERE unsubscribed_at IS NULL; -- Abonnés
SELECT COUNT(DISTINCT email) FROM video WHERE email IS NOT NULL; -- Réalisateurs
SELECT COUNT(*) FROM user WHERE role = 'admin' OR role = 'superadmin'; -- Sélectionneurs
SELECT COUNT(*) FROM user WHERE role = 'jury'; -- Jury
```

### **Le compteur n'affiche pas de chiffres**
➡️ Vérifie que le backend est bien lancé sur **port 4000** et que l'API répond :
```bash
curl http://localhost:4000/api/newsletter/campaign/preview \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"recipients":["newsletter"]}'
```

---

## 📁 Fichiers Créés/Modifiés

### **Backend**
- ✅ `src/models/newsletter.model.js` (étendu)
- ✅ `src/services/emailService.js` (étendu)
- ✅ `src/controllers/newsletter.controller.js` (étendu)
- ✅ `src/validators/newsletter.validator.js` (étendu)
- ✅ `src/routes/newsletter.routes.js` (étendu)

### **Frontend**
- ✅ `src/pages/admin/NewsletterAdmin.jsx` (nouveau)
- ✅ `src/services/newsletterService.js` (étendu)

### **Documentation**
- ✅ `NEWSLETTER_ADMIN_GUIDE.md` (ce fichier)

---

## 🎬 **MarsAI Newsletter Admin** - Prêt à l'emploi ! 🚀

