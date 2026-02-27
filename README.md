# MarsAI - Plateforme de Festival de Films

MarsAI est une plateforme web full-stack destinee a la gestion d'un festival de films. Elle permet aux cineastes de soumettre leurs films, a une equipe de jury d'evaluer les soumissions, et au public de consulter le catalogue des films valides et les evenements du festival.

---

## Fonctionnalites principales

- **Authentification** : Inscription, connexion, gestion de session via JWT
- **Soumission de films** : Upload de fichier video local ou lien YouTube, avec couverture, synopsis, contributeurs, tags et sous-titres
- **Interface jury** : Lecteur fullscreen style TikTok avec swipe pour noter ou rejeter les films
- **Moderation admin** : Validation, rejet et assignation des films a un jury
- **Catalogue public** : Liste des films valides avec filtres et recherche full-text
- **Page detail film** : Synopsis, equipe, captures, liens reseaux sociaux, prix recus
- **CMS dynamique** : Homepage configurable par phases (avant / pendant / apres le festival)
- **Evenements et reservations** : Gestion d'evenements avec stock de places et QR codes d'entree
- **Newsletter** : Inscription et desinscription par email
- **Sponsors** : Page de presentation des partenaires
- **Systeme de prix** : Attribution de recompenses aux films gagnants

---

## Stack technique

### Backend
- Node.js avec Express 5
- MySQL 8 via `mysql2`
- Authentification JWT (`jsonwebtoken`, `bcrypt`)
- Upload de fichiers avec `multer`
- Traitement video avec `fluent-ffmpeg`
- Stockage objet sur Scaleway (compatible S3) avec `@aws-sdk/client-s3`
- Integration YouTube Data API v3 via `googleapis`
- Envoi d'emails avec `nodemailer`
- Validation des donnees avec `zod`
- Securite : `helmet`, `express-rate-limit`, `cors`

### Frontend
- React 19 avec Vite
- Routing avec React Router v7
- Style avec TailwindCSS 4
- Animations avec `motion` (Framer Motion)
- Internationalisation avec `i18next`
- Composants UI : Radix UI, Lucide React

---

## Structure du projet

```
MarsAi/
  backend/
    src/
      app.js              # Configuration Express
      server.js           # Point d'entree
      config/             # Variables d'environnement, JWT
      controllers/        # Logique metier par domaine
      routes/             # Definition des routes API
      models/             # Requetes SQL
      middlewares/        # Auth, validation, securite
      services/           # Services externes (email, S3, YouTube)
      db/                 # Connexion MySQL
  frontend/
    src/
      pages/              # Pages React
      components/         # Composants reutilisables
      hooks/              # Hooks custom
      services/           # Appels API
      locales/            # Fichiers de traduction
  shared/
    validators/           # Schemas Zod partages
```

---

## Prerequis

- Node.js >= 18
- MySQL 8
- Un serveur SMTP (pour les emails)
- Un bucket Scaleway Object Storage (compatible S3) pour le stockage des videos

---

## Installation

### 1. Cloner le depot

```bash
git clone <url-du-repo>
cd MarsAi
```

### 2. Importer la base de donnees

Un export SQL est fourni a la racine du projet : `marsai (1).sql`

Creer la base de donnees et importer le fichier :

```bash
mysql -u <votre_user> -p -e "CREATE DATABASE marsai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u <votre_user> -p marsai < "marsai (1).sql"
```

Ou via phpMyAdmin :
1. Creer une base de donnees nommee `marsai`
2. Aller dans l'onglet "Importer"
3. Selectionner le fichier `marsai (1).sql`
4. Cliquer sur "Executer"

### 3. Configurer le backend

```bash
cd backend
cp .env.example .env
```

Remplir le fichier `.env` :

```env
PORT=4000
NODE_ENV=development

# Base de donnees
DB_HOST=localhost
DB_PORT=3306
DB_USER=<votre_user_mysql>
DB_PASS=<votre_mot_de_passe_mysql>
DB_NAME=marsai

# JWT - generer une cle avec :
# node -e "console.log(require('crypto').randomBytes(64).toString('hex'));"
JWT_SECRET=<votre_cle_secrete>

# Email (SMTP)
EMAIL_HOST=<smtp.votre-fournisseur.com>
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=<votre_email>
EMAIL_PASSWORD=<votre_mot_de_passe_email>

# URL du frontend
WEBSITE_URL=http://localhost:5173

# YouTube API (optionnel - requis pour la soumission via lien YouTube)
YT_CLIENT_ID=
YT_CLIENT_SECRET=
YT_REDIRECT_URL=
YT_REFRESH_TOKEN=

# Google reCAPTCHA (optionnel)
GOOGLE_RECAPTCHA_SECRET_KEY=

# Scaleway Object Storage (optionnel - requis pour le stockage S3)
SCALEWAY_ACCESS_KEY=
SCALEWAY_SECRET_KEY=
SCALEWAY_ENDPOINT=
SCALEWAY_BUCKET_NAME=
SCALEWAY_REGION=
SCALEWAY_FOLDER=
```

Installer les dependances et demarrer :

```bash
npm install
npm run dev
```

Le backend sera accessible sur `http://localhost:4000`.

### 4. Configurer le frontend

```bash
cd ../frontend
cp .env.example .env
```

Remplir le fichier `.env` :

```env
VITE_API_URL=http://localhost:4000/api
VITE_GOOGLE_RECAPTCHA_SITE_KEY=<votre_cle_recaptcha_publique>
```

Installer les dependances et demarrer :

```bash
npm install
npm run dev
```

Le frontend sera accessible sur `http://localhost:5173`.

---

## Scripts disponibles

### Backend

| Commande | Description |
|---|---|
| `npm run dev` | Demarre le serveur en mode developpement (nodemon) |
| `npm start` | Demarre le serveur en mode production |
| `npm test` | Execute les tests |
| `npm run test:coverage` | Execute les tests avec rapport de couverture |
| `npm run create-jury` | Cree un utilisateur jury via script |

### Frontend

| Commande | Description |
|---|---|
| `npm run dev` | Demarre le serveur de developpement Vite |
| `npm run build` | Compile pour la production |
| `npm run preview` | Previsualise le build de production |

---

## Routes API principales

| Methode | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Inscription |
| POST | `/api/auth/login` | Connexion |
| GET | `/api/auth/me` | Profil connecte |
| GET | `/api/videos` | Liste des films (public) |
| POST | `/api/upload` | Soumission d'un film |
| GET | `/api/jury/feed` | Feed jury |
| POST | `/api/jury/rate/:id` | Notation jury |
| GET | `/api/admin/videos` | Liste admin |
| PATCH | `/api/admin/videos/:id/status` | Changer statut |
| GET | `/api/events` | Liste evenements |
| POST | `/api/newsletter/subscribe` | Inscription newsletter |

---

## Base de donnees

Le schema de la base de donnees comprend les tables suivantes :

- `users` : Comptes utilisateurs (cineastes, jury, admins)
- `videos` : Films soumis
- `admin_video` : Historique de moderation
- `selector_memo` : Notes et signets du jury
- `events` : Evenements du festival
- `reservations` : Reservations avec QR codes
- `newsletter` : Abonnements newsletter
- `awards` : Prix et recompenses
- `sponsors` : Partenaires
- `cms_section` : Sections de la homepage dynamique
- `tags` : Tags des films
- `activity_log` : Journal d'activite

---

## Variables d'environnement requises

Les variables marquees comme requises font echouer le demarrage du serveur si elles sont absentes :

- `DB_HOST`, `DB_USER`, `DB_NAME`
- `JWT_SECRET`
- `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASSWORD`
