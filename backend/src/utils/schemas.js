import { z } from 'zod';

export const juryRegisterSchema = z.object({
  email: z.string().email("Format d'email invalide"),
  password: z.string().min(8, "Le mot de passe doit faire au moins 8 caractères"),
  firstName: z.string().min(2, "Le prénom est trop court"),
  lastName: z.string().min(2, "Le nom est trop court"),
  role: z.enum(['user', 'admin']).optional()
});

export const juryLoginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis")
});