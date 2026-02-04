import { sanitizeString } from "../../utils/secure/sanitize.util.js";


// middleware pour sanitize les données entrantes, à utiliser dans les routes ou on recoit des données en string 
export const sanitizeMiddleware = (keys = []) => {
    return (req, res, next) => {
        // avec une boucle for on parcourt les key du body de la request
        for (const key in req.body) {
            // si la key est une string, on la sanitize
            if (typeof req.body[key] === 'string') {
                req.body[key] = sanitizeString(req.body[key]);
            }
        }
        next();
    }
}