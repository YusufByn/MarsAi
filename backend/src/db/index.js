import mysql from 'mysql2/promise';
import { env } from '../config/env.js';


export const pool = mysql.createPool({
    // adresse du server
    host: env.db.host,
    // port du serv
    port: env.db.port,
    // user de la db
    user: env.db.user,
    // mot de passe de la db 
    password: env.db.password,
    // la db
    database: env.db.database,
    // limiter le nombre de connexions sur la db à 10
    connectionLimit: 10,
})

// fonction pour tester la connexion à la db
export async function testConnection(){
    // rows c'est le premier tableau retourné par la requete mysql
    const [rows] = await pool.execute('SELECT NOW() AS now');
    // rows[0].now c'est la date et l'heure actuelle
    console.log("connecté a la db sur mysql à l'heure : ", rows[0].now);
    
}