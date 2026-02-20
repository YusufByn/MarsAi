import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import { notFoundMiddleware } from './middlewares/notfound.middleware.js';
import { securityGuard } from './middlewares/security.middleware.js';
import { env } from './config/env.js';


import routes from './routes/index.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// middleware pour sécuriser l'application
app.use(helmet());
// app.use(rateLimit({ windowMs: 15*60*1_000, max: 5000 })); // rate limite pour eviter les boucle côté cms

// middleware pour gérer les CORS
app.use(cors({ origin: env.websiteUrl }));
// middleware pour parser le corps des requêtes
app.use(express.json());
// middleware pour parser les cookies
app.use(cookieParser());
app.use(morgan('dev'));
// middleware pour compresser les réponses
app.use(compression());
// middleware pour parser les requêtes URL encodées
app.use(express.urlencoded({ extended: true }));


// anti attacks
app.use('/api', securityGuard);

// uploads — Cross-Origin-Resource-Policy: cross-origin requis car le frontend
// (localhost:5173) charge des ressources depuis le backend (localhost:4000)
// Helmet applique same-origin par défaut ce qui bloque les images/vidéos cross-origin
app.use('/uploads', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.join(__dirname, 'uploads')));

// toutes les routes
app.use('/api', routes);

// middleware pour gérer les erreurs
app.use((err, req, res, next) => {
  console.error(err);
  const body = { message: 'Internal server error', success: false };
  if (env.nodeEnv !== 'production') body.error = err.message;
  res.status(500).json(body);
});

// middleware pour gérer les routes non trouvées
app.use(notFoundMiddleware);

export default app;