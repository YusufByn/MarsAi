import { z } from 'zod';

export const juryRegisterSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(2, "First name is too short"),
  lastName: z.string().min(2, "Last name is too short"),
  role: z.enum(['user', 'admin']).optional()
});

export const juryLoginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password required")
});

// Schéma pour la soumission de vidéo
export const videoSubmitSchema = z.object({
  // Champs obligatoires
  title: z.string().min(3, "Title must be at least 3 characters"),
  synopsis: z.string().min(10, "Synopsis must be at least 10 characters"),
  rights_accepted: z.string().refine(val => val === 'true', {
    message: "Rights acceptance is required"
  }),
  
  // Champs optionnels avec valeurs par défaut
  title_en: z.string().optional(),
  synopsis_en: z.string().optional(),
  classification: z.enum(['ia', 'hybrid']).default('hybrid'),
  language: z.string().optional(),
  country: z.string().optional(),
  duration: z.string().optional(),
  
  // URL YouTube (optionnel, mutuellement exclusif avec upload)
  youtube_url: z.string().url().optional(),
  
  // Informations techniques
  tech_resume: z.string().optional(),
  creative_resume: z.string().optional(),
  
  // Informations réalisateur
  realisator_name: z.string().optional(),
  realisator_lastname: z.string().optional(),
  realisator_gender: z.enum(['homme', 'femme', 'autre']).optional(),
  email: z.string().email().optional(),
  birthday: z.string().optional(),
  mobile_number: z.string().optional(),
  fixe_number: z.string().optional(),
  address: z.string().optional(),
  acquisition_source: z.string().optional(),
  
  // Relations (JSON stringifié)
  contributors: z.string().optional(),
  tags: z.string().optional(),
  social_media: z.string().optional()
});

// Schéma pour un contributeur
export const contributorSchema = z.object({
  name: z.string().min(1),
  last_name: z.string().min(1),
  production_role: z.string().min(1),
  gender: z.enum(['homme', 'femme', 'autre']).optional(),
  email: z.string().email().optional()
});

// Schéma pour un lien social media
export const socialMediaSchema = z.object({
  platform: z.enum(['instagram', 'facebook', 'linkedin', 'tiktok', 'youtube', 'website', 'x']),
  url: z.string().url()
});