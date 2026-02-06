import { z } from 'zod';

/**
 * Validators pour les soumissions et modifications de vidéos
 * Basé sur la table `video` de la base de données
 */

// ========================================
// SCHEMAS DE BASE
// ========================================

/**
 * Schema pour la création d'une vidéo (POST /api/videos/submit)
 * Tous les champs obligatoires doivent être présents
 */
export const createVideoSchema = z.object({
  // Titres (obligatoires)
  title: z
    .string({ required_error: 'Le titre en version originale est requis' })
    .trim()
    .min(2, 'Le titre doit contenir au moins 2 caractères')
    .max(255, 'Le titre ne doit pas dépasser 255 caractères'),

  title_en: z
    .string({ required_error: 'Le titre en anglais est requis' })
    .trim()
    .min(2, 'Le titre anglais doit contenir au moins 2 caractères')
    .max(255, 'Le titre anglais ne doit pas dépasser 255 caractères'),

  // Synopsis (obligatoires)
  synopsis: z
    .string({ required_error: 'Le synopsis en version originale est requis' })
    .trim()
    .min(10, 'Le synopsis doit contenir au moins 10 caractères')
    .max(5000, 'Le synopsis ne doit pas dépasser 5000 caractères'),

  synopsis_en: z
    .string({ required_error: 'Le synopsis en anglais est requis' })
    .trim()
    .min(10, 'Le synopsis anglais doit contenir au moins 10 caractères')
    .max(5000, 'Le synopsis anglais ne doit pas dépasser 5000 caractères'),

  // Métadonnées (optionnelles)
  language: z
    .string()
    .trim()
    .max(50, 'La langue ne doit pas dépasser 50 caractères')
    .optional(),

  country: z
    .string()
    .trim()
    .max(100, 'Le pays ne doit pas dépasser 100 caractères')
    .optional(),

  duration: z
    .number({ invalid_type_error: 'La durée doit être un nombre' })
    .int('La durée doit être un nombre entier')
    .positive('La durée doit être positive')
    .max(86400, 'La durée ne doit pas dépasser 24 heures')
    .optional()
    .or(z.string().regex(/^\d+$/).transform(Number).optional()),

  // Classification IA (obligatoire)
  classification: z
    .enum(['ia', 'hybrid'], {
      required_error: 'La classification est requise',
      invalid_type_error: 'La classification doit être "ia" ou "hybrid"'
    }),

  tech_resume: z
    .string()
    .trim()
    .max(5000, 'Le résumé technique ne doit pas dépasser 5000 caractères')
    .optional(),

  creative_resume: z
    .string()
    .trim()
    .max(5000, 'Le résumé créatif ne doit pas dépasser 5000 caractères')
    .optional(),

  // Informations réalisateur (obligatoires)
  realisator_name: z
    .string({ required_error: 'Le prénom du réalisateur est requis' })
    .trim()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(100, 'Le prénom ne doit pas dépasser 100 caractères'),

  realisator_lastname: z
    .string({ required_error: 'Le nom du réalisateur est requis' })
    .trim()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne doit pas dépasser 100 caractères'),

  realisator_gender: z
    .string({ required_error: 'Le genre est requis' })
    .trim()
    .max(10, 'Le genre ne doit pas dépasser 10 caractères'),

  email: z
    .string({ required_error: 'L\'email est requis' })
    .email('Format d\'email invalide')
    .toLowerCase()
    .trim()
    .max(255, 'L\'email ne doit pas dépasser 255 caractères'),

  // Coordonnées (optionnelles)
  birthday: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide (YYYY-MM-DD)')
    .optional()
    .or(z.date().optional()),

  mobile_number: z
    .string()
    .trim()
    .max(20, 'Le numéro de mobile ne doit pas dépasser 20 caractères')
    .optional(),

  fixe_number: z
    .string()
    .trim()
    .max(20, 'Le numéro fixe ne doit pas dépasser 20 caractères')
    .optional(),

  address: z
    .string()
    .trim()
    .max(255, 'L\'adresse ne doit pas dépasser 255 caractères')
    .optional(),

  acquisition_source: z
    .string()
    .trim()
    .max(100, 'La source d\'acquisition ne doit pas dépasser 100 caractères')
    .optional(),

  // Droits (obligatoire)
  rights_accepted: z
    .boolean({ required_error: 'L\'acceptation des droits est requise' })
    .refine((val) => val === true, {
      message: 'Vous devez accepter les conditions et céder les droits pour soumettre votre film'
    }),

  // YouTube URL (optionnel, informatif)
  youtube_url: z
    .string()
    .url('Format d\'URL YouTube invalide')
    .max(500, 'L\'URL ne doit pas dépasser 500 caractères')
    .optional()
    .or(z.literal('')),

  // Noms de fichiers (seront ajoutés par le backend après upload)
  video_file_name: z.string().optional(),
  cover: z.string().optional(),
  srt_file_name: z.string().optional(),

  // Tags (optionnel, envoyé en JSON stringifié depuis le frontend)
  tags: z.string().optional()
});

/**
 * Schema pour la mise à jour d'une vidéo (PUT /api/videos/:id/update)
 * Tous les champs sont optionnels (on ne met à jour que ce qui est fourni)
 */
export const updateVideoSchema = z.object({
  // Titres
  title: z
    .string()
    .trim()
    .min(2, 'Le titre doit contenir au moins 2 caractères')
    .max(255, 'Le titre ne doit pas dépasser 255 caractères')
    .optional(),

  title_en: z
    .string()
    .trim()
    .min(2, 'Le titre anglais doit contenir au moins 2 caractères')
    .max(255, 'Le titre anglais ne doit pas dépasser 255 caractères')
    .optional(),

  // Synopsis
  synopsis: z
    .string()
    .trim()
    .min(10, 'Le synopsis doit contenir au moins 10 caractères')
    .max(5000, 'Le synopsis ne doit pas dépasser 5000 caractères')
    .optional(),

  synopsis_en: z
    .string()
    .trim()
    .min(10, 'Le synopsis anglais doit contenir au moins 10 caractères')
    .max(5000, 'Le synopsis anglais ne doit pas dépasser 5000 caractères')
    .optional(),

  // Métadonnées
  language: z
    .string()
    .trim()
    .max(50, 'La langue ne doit pas dépasser 50 caractères')
    .optional(),

  country: z
    .string()
    .trim()
    .max(100, 'Le pays ne doit pas dépasser 100 caractères')
    .optional(),

  duration: z
    .number({ invalid_type_error: 'La durée doit être un nombre' })
    .int('La durée doit être un nombre entier')
    .positive('La durée doit être positive')
    .max(86400, 'La durée ne doit pas dépasser 24 heures')
    .optional()
    .or(z.string().regex(/^\d+$/).transform(Number).optional()),

  // Classification
  classification: z
    .enum(['ia', 'hybrid'], {
      invalid_type_error: 'La classification doit être "ia" ou "hybrid"'
    })
    .optional(),

  tech_resume: z
    .string()
    .trim()
    .max(5000, 'Le résumé technique ne doit pas dépasser 5000 caractères')
    .optional(),

  creative_resume: z
    .string()
    .trim()
    .max(5000, 'Le résumé créatif ne doit pas dépasser 5000 caractères')
    .optional(),

  // Informations réalisateur
  realisator_name: z
    .string()
    .trim()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(100, 'Le prénom ne doit pas dépasser 100 caractères')
    .optional(),

  realisator_lastname: z
    .string()
    .trim()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne doit pas dépasser 100 caractères')
    .optional(),

  realisator_gender: z
    .string()
    .trim()
    .max(10, 'Le genre ne doit pas dépasser 10 caractères')
    .optional(),

  email: z
    .string()
    .email('Format d\'email invalide')
    .toLowerCase()
    .trim()
    .max(255, 'L\'email ne doit pas dépasser 255 caractères')
    .optional(),

  // Coordonnées
  birthday: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide (YYYY-MM-DD)')
    .optional()
    .or(z.date().optional()),

  mobile_number: z
    .string()
    .trim()
    .max(20, 'Le numéro de mobile ne doit pas dépasser 20 caractères')
    .optional(),

  fixe_number: z
    .string()
    .trim()
    .max(20, 'Le numéro fixe ne doit pas dépasser 20 caractères')
    .optional(),

  address: z
    .string()
    .trim()
    .max(255, 'L\'adresse ne doit pas dépasser 255 caractères')
    .optional(),

  acquisition_source: z
    .string()
    .trim()
    .max(100, 'La source d\'acquisition ne doit pas dépasser 100 caractères')
    .optional(),

  // YouTube URL
  youtube_url: z
    .string()
    .url('Format d\'URL YouTube invalide')
    .max(500, 'L\'URL ne doit pas dépasser 500 caractères')
    .optional()
    .or(z.literal('')),

  // Noms de fichiers (mis à jour si nouveaux fichiers uploadés)
  video_file_name: z.string().optional(),
  cover: z.string().optional(),
  srt_file_name: z.string().optional(),

  // Tags (optionnel, envoyé en JSON stringifié depuis le frontend)
  tags: z.string().optional()
});

// ========================================
// MIDDLEWARES DE VALIDATION
// ========================================

/**
 * Middleware de validation pour la création de vidéo
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction suivante
 */
export const validateCreateVideo = (req, res, next) => {
  try {
    console.log('[VALIDATOR] Validation des données reçues');
    console.log('[VALIDATOR] req.body:', Object.keys(req.body));
    console.log('[VALIDATOR] req.files:', req.files ? Object.keys(req.files) : 'aucun');

    // Convertir les champs de formulaire en types appropriés
    if (req.body.duration && typeof req.body.duration === 'string') {
      req.body.duration = parseInt(req.body.duration, 10);
    }

    if (req.body.rights_accepted) {
      // Convertir "true" / "false" string en boolean
      req.body.rights_accepted = req.body.rights_accepted === 'true' || req.body.rights_accepted === true;
    }

    // Parser et valider
    const validated = createVideoSchema.parse(req.body);
    req.body = validated;
    console.log('[VALIDATOR] Validation réussie');
    next();
  } catch (error) {
    console.error('[VALIDATOR ERROR] Erreur de validation:', error);

    if (error instanceof z.ZodError) {
      const errors = error.errors && Array.isArray(error.errors)
        ? error.errors.map(err => ({
            field: err.path ? err.path.join('.') : 'unknown',
            message: err.message
          }))
        : [{ field: 'unknown', message: 'Erreur de validation inconnue' }];

      return res.status(400).json({
        success: false,
        message: 'Validation des données échouée',
        errors
      });
    }

    // Erreur non-Zod
    return res.status(500).json({
      success: false,
      message: 'Erreur interne lors de la validation',
      error: error.message || 'Erreur inconnue'
    });
  }
};

/**
 * Middleware de validation pour la mise à jour de vidéo
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction suivante
 */
export const validateUpdateVideo = (req, res, next) => {
  try {
    console.log('[VALIDATOR] Validation update des données reçues');
    console.log('[VALIDATOR] req.body:', Object.keys(req.body || {}));
    console.log('[VALIDATOR] req.files:', req.files ? Object.keys(req.files) : 'aucun');

    // Convertir les champs de formulaire en types appropriés
    if (req.body.duration && typeof req.body.duration === 'string') {
      req.body.duration = parseInt(req.body.duration, 10);
    }

    // Parser et valider
    const validated = updateVideoSchema.parse(req.body);
    req.body = validated;
    console.log('[VALIDATOR] Validation update réussie');
    next();
  } catch (error) {
    console.error('[VALIDATOR ERROR] Erreur de validation update:', error);

    if (error instanceof z.ZodError) {
      const errors = error.errors && Array.isArray(error.errors)
        ? error.errors.map(err => ({
            field: err.path ? err.path.join('.') : 'unknown',
            message: err.message
          }))
        : [{ field: 'unknown', message: 'Erreur de validation inconnue' }];

      return res.status(400).json({
        success: false,
        message: 'Validation des données échouée',
        errors
      });
    }

    // Erreur non-Zod
    return res.status(500).json({
      success: false,
      message: 'Erreur interne lors de la validation',
      error: error.message || 'Erreur inconnue'
    });
  }
};

// ========================================
// EXPORTS
// ========================================

export default {
  createVideoSchema,
  updateVideoSchema,
  validateCreateVideo,
  validateUpdateVideo
};
