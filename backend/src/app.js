import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import { notFoundMiddleware } from './middlewares/notfound.middleware.js';
import authRoutes from './routes/auth.routes.js'
import uploadRoutes from './routes/upload.routes.js';
import juryRoutes from './routes/jury.routes.js';
import newsletterRoutes from './routes/newsletter.routes.js';
import testRoutes from './routes/test.routes.js';
import memoRoutes from './routes/memo.routes.js';
import ratingRoutes from './routes/rating.routes.js';
import videoRoutes from './routes/video.routes.js';
import youtubeRoutes from './routes/youtube.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();


// config de l'app
app.use(helmet());
app.use(rateLimit({ windowMs: 15*60*1000, max: 100 }));
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(compression());
app.use(express.urlencoded({ extended: true }));

// servir les fichiers statiques (vidéos uploadées)
// Remonter d'un niveau depuis src/ pour accéder à uploads/
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/jury', juryRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/memo', memoRoutes);
app.use('/api/rating', ratingRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api', testRoutes);
app.use('/api/youtube', youtubeRoutes);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({
        message: 'Erreur interne du serveur',
        error: err.message
    });
})

app.use(notFoundMiddleware);

export default app;