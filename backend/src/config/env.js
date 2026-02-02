// import l'outil dotenv
import dotenv from 'dotenv';

// config dans dotenv
dotenv.config();

// lister et verifier les infos necessaire
const required = ['DB_HOST', 'DB_USER', 'DB_NAME', 'JWT_SECRET', 'EMAIL_HOST', 'EMAIL_USER', 'EMAIL_PASSWORD'];
for (const key of required) {
    if(!process.env[key]){
        throw new Error(`${key}: manquant dans le fichier d'environnement`)
    }
}

// exportation 
export const env = {
    port: Number(process.env.PORT ?? 4000),
    db: {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT ?? 3306),
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    },
    jwtSecret: process.env.JWT_SECRET,
    email: {
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT ?? 587),
        secure: process.env.EMAIL_SECURE === 'true', // true pour 465, false pour 587
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASSWORD
    },
    websiteUrl: process.env.WEBSITE_URL ?? 'http://localhost:5173',
    youtube: {
        clientId: process.env.YT_CLIENT_ID,
        clientSecret: process.env.YT_CLIENT_SECRET,
        redirectUrl: process.env.YT_REDIRECT_URL,
        refreshToken: process.env.YT_REFRESH_TOKEN
    }
}