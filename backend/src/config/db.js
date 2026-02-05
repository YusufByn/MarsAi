import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Configuration de la connexion à la base de données
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS || process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Création du pool de connexions
const pool = mysql.createPool(dbConfig);

// Fonction pour tester la connexion
export async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Connexion à la base de données réussie');
        connection.release();
        return true;
    } catch (error) {
        console.error('Erreur de connexion à la base de données:', error.message);
        return false;
    }
}

export default pool;