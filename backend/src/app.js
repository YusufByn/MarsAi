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


import routes from './routes/index.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsFromRoot = path.join(__dirname, '..', 'uploads');

const app = express();

// middleware pour sécuriser l'application
app.use(
  helmet({
    // Permet de servir les images statiques /uploads vers le front (port différent)
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
// app.use(rateLimit({ windowMs: 15*60*1_000, max: 5000 })); // rate limite pour eviter les boucle côté cms

// middleware pour gérer les CORS
app.use(cors());
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

// uploads
// Source unique des médias: backend/uploads
app.use('/uploads', express.static(uploadsFromRoot));

// toutes les routes
app.use('/api', routes);

// middleware pour gérer les erreurs
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    message: 'Internal server error',
    error: err.message,
    success: false
  });
});

// middleware pour gérer les routes non trouvées
app.use(notFoundMiddleware);

export default app;