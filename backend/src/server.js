import app from './app.js';
import { env } from './config/env.js';
import { testConnection } from './db/index.js';

// fonction start pour demarrer le serv

async function startServer(){
    try {
        // on attend la promise de la fonction testConnection
        await testConnection();
        // on demarre le serv
        app.listen(env.port, () => {
            console.log(`server lancé sur le port suivant : ${env.port}`);
        });

    } catch (error) {
        console.error('Erreur lors du démarrage du serveur:', error);
        // porcess exit 1 permet d'arreter le programme
        process.exit(1);
    }
}

startServer();