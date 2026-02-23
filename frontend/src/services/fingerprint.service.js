import FingerprintJS from '@fingerprintjs/fingerprintjs';

const STORAGE_KEY = 'x-device-id';

let _promise = null;

/**
 * Lance la génération du fingerprint une seule fois.
 * Stocke le résultat dans sessionStorage pour les lectures synchrones.
 * Appelé au démarrage de l'app (main.jsx).
 */
export const initFingerprint = () => {
  if (_promise) return _promise;

  _promise = FingerprintJS.load()
    .then((fp) => fp.get())
    .then((result) => {
      sessionStorage.setItem(STORAGE_KEY, result.visitorId);
      console.log('[FINGERPRINT] Device ID généré');
      return result.visitorId;
    })
    .catch((err) => {
      console.error('[FINGERPRINT] Erreur génération:', err.message);
      return '';
    });

  return _promise;
};

/**
 * Lecture synchrone du fingerprint depuis le cache sessionStorage.
 * Retourne '' si pas encore disponible (première requête très rapide).
 */
export const getFingerprint = () => {
  return sessionStorage.getItem(STORAGE_KEY) || '';
};
