# 📋 Feature Jury - Documentation

## 🎯 Description

Cette feature permet de gérer les profils des jurys du festival MarsAI. Les jurys sont des personnalités qui vont élire les films finaux lors du festival. Ils ne sont pas connectés au système, c'est uniquement une vitrine publique.

## 🏗️ Architecture

### Backend
- **Model** : `backend/src/models/jury.model.js` - Requêtes SQL
- **Controller** : `backend/src/controllers/jury.controller.js` - Logique métier
- **Routes** : `backend/src/routes/jury.routes.js` - Endpoints API
- **Validator** : `backend/src/validators/jury.validator.js` - Validation Zod
- **Tests** : `backend/src/tests/jury.test.js` - Tests unitaires

### Frontend
- **Service** : `frontend/src/services/juryService.js` - Appels API
- **Page** : `frontend/src/pages/user/JuryDetails.jsx` - Affichage profil
- **Route** : `/jury/profil/:id` - URL publique

## 📡 API Endpoints

### Routes publiques

#### `GET /api/jury`
Récupère tous les jurys.

**Réponse** :
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Dupont",
      "lastname": "Jean",
      "illustration": "https://example.com/photo.jpg",
      "biographie": "Cinéaste reconnu...",
      "created_at": "2026-01-28T10:00:00.000Z"
    }
  ]
}
```

#### `GET /api/jury/:id`
Récupère un jury spécifique.

**Réponse** :
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Dupont",
    "lastname": "Jean",
    "illustration": "https://example.com/photo.jpg",
    "biographie": "Cinéaste reconnu...",
    "created_at": "2026-01-28T10:00:00.000Z"
  }
}
```

### Routes protégées (superadmin uniquement)

⚠️ **Note** : L'authentification n'est pas encore implémentée. À sécuriser plus tard.

#### `POST /api/jury`
Crée un nouveau jury.

**Body** :
```json
{
  "name": "Dupont",
  "lastname": "Jean",
  "illustration": "https://example.com/photo.jpg",
  "biographie": "Cinéaste reconnu avec 20 ans d'expérience..."
}
```

**Réponse** :
```json
{
  "success": true,
  "message": "Jury créé avec succès",
  "data": { ... }
}
```

#### `PUT /api/jury/:id`
Met à jour un jury existant.

**Body** (tous les champs optionnels) :
```json
{
  "name": "Martin",
  "lastname": "Sophie",
  "biographie": "Nouvelle biographie..."
}
```

#### `DELETE /api/jury/:id`
Supprime un jury.

**Réponse** :
```json
{
  "success": true,
  "message": "Jury supprimé avec succès"
}
```

## 🧪 Tests

### Installation des dépendances de test

```bash
cd backend
npm install
```

### Lancer les tests

```bash
# Lancer tous les tests
npm test

# Lancer les tests en mode watch
npm run test:watch

# Lancer les tests avec couverture
npm run test:coverage
```

### Tests manuels avec curl

#### 1. Créer un jury
```bash
curl -X POST http://localhost:4000/api/jury \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dupont",
    "lastname": "Jean",
    "illustration": "https://via.placeholder.com/300",
    "biographie": "Cinéaste reconnu avec 20 ans d'\''expérience dans le cinéma d'\''auteur."
  }'
```

#### 2. Récupérer tous les jurys
```bash
curl http://localhost:4000/api/jury
```

#### 3. Récupérer un jury par ID
```bash
curl http://localhost:4000/api/jury/1
```

#### 4. Mettre à jour un jury
```bash
curl -X PUT http://localhost:4000/api/jury/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Martin",
    "lastname": "Sophie"
  }'
```

#### 5. Supprimer un jury
```bash
curl -X DELETE http://localhost:4000/api/jury/1
```

## 🚀 Démarrage

### Backend

```bash
cd backend

# Lancer en mode développement
npm run dev

# Le serveur démarre sur http://localhost:4000
```

### Frontend

```bash
cd frontend

# Lancer en mode développement
npm run dev

# L'application démarre sur http://localhost:5173
```

### Accéder à la page d'un jury

Ouvrez votre navigateur et allez à :
```
http://localhost:5173/jury/profil/1
```

(Remplacez `1` par l'ID du jury que vous avez créé)

## 📊 Base de données

La table `jury` existe déjà dans votre BDD (voir `marsIA_BDD.sql` ligne 307-317) :

```sql
CREATE TABLE `jury` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `lastname` VARCHAR(100) NOT NULL,
  `illustration` VARCHAR(500) COMMENT 'Photo',
  `biographie` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## ✅ Checklist de validation

- [x] Backend : Models, Controllers, Routes, Validators créés
- [x] Frontend : Service API et composant JuryDetails créés
- [x] React Router configuré pour `/jury/profil/:id`
- [x] Tests unitaires créés
- [ ] Installer les dépendances de test : `cd backend && npm install`
- [ ] Lancer le backend : `npm run dev`
- [ ] Lancer le frontend : `npm run dev`
- [ ] Créer un jury via l'API (curl ou Postman)
- [ ] Tester l'affichage frontend sur `/jury/profil/1`
- [ ] Lancer les tests unitaires : `npm test`

## 🔮 Améliorations futures

- [ ] Ajouter middleware d'authentification pour les routes protégées
- [ ] Créer page admin pour gérer les jurys (CRUD complet)
- [ ] Ajouter upload d'images pour `illustration`
- [ ] Ajouter pagination sur `GET /api/jury`
- [ ] Ajouter recherche/filtres
- [ ] Lier les jurys aux films qu'ils ont élus (table de jonction)
- [ ] Ajouter réseaux sociaux des jurys

## 🐛 Troubleshooting

### Erreur de connexion à la BDD
Vérifiez que votre fichier `.env` contient :
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=votre_user
DB_PASS=votre_password
DB_NAME=marsIA
JWT_SECRET=votre_secret
```

### Erreur 404 sur les routes API
Vérifiez que le backend est bien lancé sur le port 4000 et que `app.js` importe bien les routes jury.

### Page blanche sur le frontend
Vérifiez que :
1. React Router est bien configuré dans `App.jsx`
2. Le fichier `.env` du frontend contient `VITE_API_URL=http://localhost:4000`
3. Le backend est lancé et accessible

---

**Créé le** : 28 janvier 2026  
**Auteur** : William (Feature Owner)
