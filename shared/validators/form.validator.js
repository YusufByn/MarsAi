import { z } from 'zod';

/**
 * SCHÉMAS DE VALIDATION POUR LE FORMULAIRE DE PARTICIPATION
 * 
 * Ces schémas définissent les règles de validation pour tous les champs
 * du formulaire de données personnelles (ParticipationPersonnalData)
 */

// ============================================
// SCHÉMA COMPLET DU FORMULAIRE
// ============================================

export const participationFormSchema = z.object({
  // Genre/Civilité
  gender: z.enum(['women', 'man', 'other'], {
    errorMap: () => ({ message: "Please select a valid gender" })
  }),

  // Prénom
  firstName: z.string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters"),

  // Nom
  lastName: z.string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters"),

  // Email
  email: z.string()
    .trim()
    .toLowerCase()
    .email("Invalid email format")
    .max(100, "Email must not exceed 100 characters"),

  // Pays
  country: z.string()
    .trim()
    .min(1, "Country is required")
    .max(100, "Country name is too long"),

  // Numéro de téléphone (format international)
  phoneNumber: z.string()
    .min(1, "Phone number is required"),

  // Numéro mobile (format international)
  mobileNumber: z.string()
    .min(1, "Mobile number is required"),

  // Adresse
  address: z.string()
    .trim()
    .min(5, "Address must be at least 5 characters")
    .max(255, "Address must not exceed 200 characters"),

  // Source d'acquisition
  acquisitionSource: z.string()
    .trim()
    .min(1, "Please tell us how you heard about us")
    .max(255, "Response is too long"),

  // Vérification d'âge (18+)
  ageVerificator: z.boolean()
    .refine((val) => val === true, {
      message: "You must confirm that you are 18 years or older"
    })
});

// ============================================
// SCHÉMAS INDIVIDUELS POUR CHAQUE CHAMP
// ============================================
// Ces schémas permettent de valider les champs individuellement

export const genderSchema = z.enum(['women', 'man', 'other'], {
  errorMap: () => ({ message: "Please select a valid gender" })
});

export const firstNameSchema = z.string()
  .trim()
  .min(2, "First name must be at least 2 characters")
  .max(50, "First name must not exceed 50 characters");

export const lastNameSchema = z.string()
  .trim()
  .min(2, "Last name must be at least 2 characters")
  .max(50, "Last name must not exceed 50 characters");

export const emailSchema = z.string()
  .trim()
  .toLowerCase()
  .email("Invalid email format")
  .max(100, "Email must not exceed 100 characters");

export const countrySchema = z.string()
  .trim()
  .min(1, "Country is required")
  .max(100, "Country name is too long");

export const phoneNumberSchema = z.string()
  .min(1, "Phone number is required");

export const mobileNumberSchema = z.string()
  .min(1, "Mobile number is required");

export const addressSchema = z.string()
  .trim()
  .min(5, "Address must be at least 5 characters")
  .max(200, "Address must not exceed 200 characters");

export const acquisitionSourceSchema = z.string()
  .trim()
  .min(1, "Please tell us how you heard about us")
  .max(100, "Response is too long");

export const ageVerificatorSchema = z.boolean()
  .refine((val) => val === true, {
    message: "You must confirm that you are 18 years or older"
  });
