import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import validate from '../middlewares/validator/validate.js';
import { juryRegisterSchema, juryLoginSchema } from '../utils/schemas.util.js';

const router = express.Router();

// route pour s'inscrire
router.post('/register', validate(juryRegisterSchema), authController.register);
// route pour se connecter
router.post('/login', validate(juryLoginSchema), authController.login);

export default router;