// nettoyage de tags, évite les doublons, trim etc
// tags en param avec un tableau
export const normalizeTags = (tags = []) => {
  // on return un noueau tableau ou l'on parcour le tableau tags
  // on trim chaque tag et on les mets en minuscule
  // on filtre les tags quu sont vides ou ont une longeur supérieur à 0
  return [... new Set(
      tags
          .map(t => t.trim().toLowerCase())
          .filter(t => t.length > 0)
  )];
}

// fonction pour créer un tag qui n'existe pas, qui va s'ajouter dans le tableau
export async function upsertTags(cleanTags, connection) {
  // si le tableau est vide, on return un tableau vide
  if (cleanTags.length === 0){
      return [];
  }

  
  // étant donné que l'on ne sait pas combien de tags on va créer, on va faire une boucle pour les placeholders
  // on declare un tableau vide
  let placeholdersArray = [];
  // boucle for, on parcourt le tableau cleanTags et on ajoute un placeholder pour chaque tag
  for (let i = 0; i < cleanTags.length; i++) {
      placeholdersArray.push('(?)');
  }
  // on ajoute une virgule entre chaque placeholder
  const values = placeholdersArray.join(',');

  // execution de la requete preparee et securisée, ajout des tags qui n'existent pas 
  const query = `INSERT IGNORE INTO tag (name) VALUES ${values}`;


  await connection.execute(query, cleanTags);

  // on recup l'id de chaque tag crée ainsi que leur nom
  const tagPlaceholders = cleanTags.map(() => '?').join(',');
  const secondQuery = `SELECT id, name FROM tag WHERE name IN (${tagPlaceholders})`;
  const [rows] = await connection.execute(secondQuery, cleanTags);

  console.log(rows);

  return rows;

}