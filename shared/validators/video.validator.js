import { z } from 'zod';
import {
  CONTRIBUTOR_GENDERS,
  SOCIAL_PLATFORMS,
  VIDEO_SECURITY_LIMITS
} from './video.rules.js';

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
const tagValueSchema = z
  .string()
  .trim()
  .min(2, 'Un tag doit contenir au moins 2 caractères')
  .max(20, 'Un tag ne doit pas dépasser 20 caractères');

const tagsSchema = z.preprocess((value) => {
  if (value === undefined || value === null || value === '') return undefined;

  if (Array.isArray(value)) {
    return value.map((tag) => String(tag || '').trim()).filter(Boolean);
  }

  if (typeof value === 'string') {
    const trimmedValue = value.trim();
    if (!trimmedValue) return undefined;

    if (trimmedValue.startsWith('[') && trimmedValue.endsWith(']')) {
      try {
        const parsedValue = JSON.parse(trimmedValue);
        if (Array.isArray(parsedValue)) {
          return parsedValue.map((tag) => String(tag || '').trim()).filter(Boolean);
        }
      } catch {
        // fallback: treat as single tag
      }
    }

    return [trimmedValue];
  }

  return value;
}, z.array(tagValueSchema).max(10, 'Maximum 10 tags autorisés')).optional();

const socialNetworkEntrySchema = z.object({
  platform: z.enum(SOCIAL_PLATFORMS, {
    invalid_type_error: 'Plateforme sociale invalide'
  }),
  url: z
    .string()
    .trim()
    .url('URL de réseau social invalide')
    .max(VIDEO_SECURITY_LIMITS.socialUrlMaxLength, `L'URL ne doit pas dépasser ${VIDEO_SECURITY_LIMITS.socialUrlMaxLength} caractères`)
});

const socialNetworksSchema = z.preprocess((value) => {
  if (value === undefined || value === null || value === '') return undefined;

  if (Array.isArray(value)) return value;

  if (typeof value === 'string') {
    const trimmedValue = value.trim();
    if (!trimmedValue) return undefined;

    if (trimmedValue.length > VIDEO_SECURITY_LIMITS.socialNetworksPayloadMaxLength) {
      return '__SOCIAL_NETWORKS_TOO_LARGE__';
    }

    try {
      const parsedValue = JSON.parse(trimmedValue);
      return Array.isArray(parsedValue) ? parsedValue : '__SOCIAL_NETWORKS_INVALID__';
    } catch {
      return '__SOCIAL_NETWORKS_INVALID__';
    }
  }

  return '__SOCIAL_NETWORKS_INVALID__';
}, z.array(socialNetworkEntrySchema).max(
  VIDEO_SECURITY_LIMITS.maxSocialNetworks,
  `Maximum ${VIDEO_SECURITY_LIMITS.maxSocialNetworks} réseaux sociaux autorisés`
)).optional();

const contributorEntrySchema = z.object({
  gender: z.enum(CONTRIBUTOR_GENDERS).optional().or(z.literal('')).or(z.null()),
  firstName: z.string().trim().min(2, 'Le prénom du contributeur doit contenir au moins 2 caractères').max(100, 'Le prénom du contributeur ne doit pas dépasser 100 caractères'),
  lastName: z.string().trim().min(2, 'Le nom du contributeur doit contenir au moins 2 caractères').max(100, 'Le nom du contributeur ne doit pas dépasser 100 caractères'),
  email: z.string().trim().toLowerCase().email('Email contributeur invalide').max(255, 'Email contributeur trop long'),
  productionRole: z.string().trim().min(2, 'Le rôle contributeur doit contenir au moins 2 caractères').max(80, 'Le rôle contributeur ne doit pas dépasser 80 caractères')
});

const contributorsSchema = z.preprocess((value) => {
  if (value === undefined || value === null || value === '') return undefined;

  if (Array.isArray(value)) return value;

  if (typeof value === 'string') {
    const trimmedValue = value.trim();
    if (!trimmedValue) return undefined;

    if (trimmedValue.length > VIDEO_SECURITY_LIMITS.contributorsPayloadMaxLength) {
      return '__CONTRIBUTORS_TOO_LARGE__';
    }

    try {
      const parsedValue = JSON.parse(trimmedValue);
      return Array.isArray(parsedValue) ? parsedValue : '__CONTRIBUTORS_INVALID__';
    } catch {
      return '__CONTRIBUTORS_INVALID__';
    }
  }

  return '__CONTRIBUTORS_INVALID__';
}, z.array(contributorEntrySchema).max(
  VIDEO_SECURITY_LIMITS.maxContributors,
  `Maximum ${VIDEO_SECURITY_LIMITS.maxContributors} contributeurs autorisés`
)).optional();

export const createVideoSchema = z.object({
  // Titre version originale (optionnel)
  title: z
    .string()
    .trim()
    .min(2, 'Le titre doit contenir au moins 2 caractères')
    .max(255, 'Le titre ne doit pas dépasser 255 caractères')
    .optional()
    .or(z.literal('')),
  // Titre en anglais (obligatoire)
  title_en: z
    .string({ required_error: 'Le titre en anglais est requis' })
    .trim()
    .min(2, 'Le titre anglais doit contenir au moins 2 caractères')
    .max(255, 'Le titre anglais ne doit pas dépasser 255 caractères'),

  // Synopsis
  synopsis: z
    .string()
    .trim()
    .min(10, 'Le synopsis doit contenir au moins 10 caractères')
    .max(500, 'Le synopsis ne doit pas dépasser 500 caractères')
    .optional()
    .or(z.literal('')),
  // Synopsis en anglais (obligatoire)
  synopsis_en: z
    .string({ required_error: 'Le synopsis en anglais est requis' })
    .trim()
    .min(10, 'Le synopsis anglais doit contenir au moins 10 caractères')
    .max(500, 'Le synopsis anglais ne doit pas dépasser 500 caractères'),

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
    .max(150, 'Video too long. Maximum duration: 2:30')
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
    .max(500, 'Le résumé technique ne doit pas dépasser 500 caractères'),

  creative_resume: z
    .string()
    .trim()
    .max(500, 'Le résumé créatif ne doit pas dépasser 500 caractères'),

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
    .union([
      z.literal('0'),
      z.literal('1'),
      z.literal(0),
      z.literal(1),
      z.boolean()
    ]),

  mobile_number: z
    .string()
    .trim()
    .max(20, 'Le numéro de mobile ne doit pas dépasser 20 caractères'),

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
    .max(100, 'La source d\'acquisition ne doit pas dépasser 100 caractères'),

  // Droits (obligatoire)
  rights_accepted: z
    .boolean({ required_error: 'L\'acceptation des droits est requise' })
    .refine((val) => val === true, {
      message: 'Vous devez accepter les conditions et céder les droits pour soumettre votre film'
    }),

  // Noms de fichiers (seront ajoutés par le backend après upload)
  video_file_name: z.string().optional(),
  cover: z.string().optional(),
  srt_file_name: z.string().optional(),

  // Tags (optionnel, envoyé en JSON stringifié depuis le frontend)
  tags: tagsSchema,
  
  // Données enrichies (optionnelles, utilisées pendant la soumission multipart)
  contributors: contributorsSchema,
  social_networks: socialNetworksSchema,
  recaptchaToken: z.string().trim().max(
    VIDEO_SECURITY_LIMITS.recaptchaTokenMaxLength,
    `Le token reCAPTCHA ne doit pas dépasser ${VIDEO_SECURITY_LIMITS.recaptchaTokenMaxLength} caractères`
  ).optional(),
  acquisition_source_other: z.string().trim().max(255, 'La source d\'acquisition détaillée ne doit pas dépasser 255 caractères').optional(),
  youtube_url: z
    .string()
    .url('Format d\'URL YouTube invalide')
    .max(500, 'L\'URL ne doit pas dépasser 500 caractères')
    .optional()
    .or(z.literal(''))
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
    .max(500, 'Le synopsis ne doit pas dépasser 500 caractères')
    .optional(),

  synopsis_en: z
    .string()
    .trim()
    .min(10, 'Le synopsis anglais doit contenir au moins 10 caractères')
    .max(500, 'Le synopsis anglais ne doit pas dépasser 500 caractères')
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
    .max(150, 'Video too long. Maximum duration: 2:30')
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
    .max(500, 'Le résumé technique ne doit pas dépasser 500 caractères')
    .optional(),

  creative_resume: z
    .string()
    .trim()
    .max(500, 'Le résumé créatif ne doit pas dépasser 500 caractères')
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
    .union([
      z.literal('0'),
      z.literal('1'),
      z.literal(0),
      z.literal(1),
      z.boolean()
    ])
    .optional(),

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

  // Noms de fichiers (mis à jour si nouveaux fichiers uploadés)
  video_file_name: z.string().optional(),
  cover: z.string().optional(),
  srt_file_name: z.string().optional(),

  // Tags (optionnel, envoyé en JSON stringifié depuis le frontend)
  tags: tagsSchema,
  contributors: contributorsSchema,
  social_networks: socialNetworksSchema
});

// ========================================
// MIDDLEWARES DE VALIDATION
// ========================================

export const validateCreateVideo = (req, res, next) => {
  try {
    // console.log('[VALIDATOR] Validation des données reçues');
    // console.log('[VALIDATOR] req.body:', Object.keys(req.body));
    // console.log('[VALIDATOR] req.files:', req.files ? Object.keys(req.files) : 'aucun');

    // Convertir les champs de formulaire en types appropriés
    if (req.body.duration && typeof req.body.duration === 'string') {
      req.body.duration = parseInt(req.body.duration, 10);
    }

    if (req.body.rights_accepted !== undefined) {
      // Accepte true/false, "true"/"false", 1/0, "1"/"0"
      const acceptedValues = new Set([true, 'true', 1, '1']);
      req.body.rights_accepted = acceptedValues.has(req.body.rights_accepted);
    }

    if (!req.files?.video?.[0]) {
      return res.status(400).json({
        success: false,
        message: 'Validation des données échouée',
        errors: [{ field: 'video', message: 'Le fichier vidéo est requis' }]
      });
    }

    if (!req.files?.cover?.[0]) {
      return res.status(400).json({
        success: false,
        message: 'Validation des données échouée',
        errors: [{ field: 'cover', message: 'L\'image de couverture est requise' }]
      });
    }

    // Parser et valider
    const validated = createVideoSchema.parse(req.body);
    req.body = validated;
    // console.log('[VALIDATOR] Validation réussie');
    next();
  } catch (error) {
    // console.error('[VALIDATOR ERROR] Erreur de validation:', error);

    if (error instanceof z.ZodError) {
      const issues = Array.isArray(error.issues)
        ? error.issues
        : (Array.isArray(error.errors) ? error.errors : []);
      const errors = issues.length > 0
        ? issues.map(err => ({
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
    // console.log('[VALIDATOR] Validation update des données reçues');
    // console.log('[VALIDATOR] req.body:', Object.keys(req.body || {}));
    // console.log('[VALIDATOR] req.files:', req.files ? Object.keys(req.files) : 'aucun');

    // Convertir les champs de formulaire en types appropriés
    if (req.body.duration && typeof req.body.duration === 'string') {
      req.body.duration = parseInt(req.body.duration, 10);
    }

    // Parser et valider
    const validated = updateVideoSchema.parse(req.body);
    req.body = validated;
    // console.log('[VALIDATOR] Validation update réussie');
    next();
  } catch (error) {
    // console.error('[VALIDATOR ERROR] Erreur de validation update:', error);

    if (error instanceof z.ZodError) {
      const issues = Array.isArray(error.issues)
        ? error.issues
        : (Array.isArray(error.errors) ? error.errors : []);
      const errors = issues.length > 0
        ? issues.map(err => ({
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
