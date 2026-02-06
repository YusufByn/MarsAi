import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import validate from '../middlewares/validator/validate.js';
import { juryRegisterSchema, juryLoginSchema } from '../utils/schemas.util.js';

const router = express.Router();

<<<<<<< HEAD


=======
// route pour s'inscrire
>>>>>>> e7ec5bc1a5944611b9aec2a7e14fde4c885aa6db
router.post('/register', validate(juryRegisterSchema), authController.register);
// route pour se connecter
router.post('/login', validate(juryLoginSchema), authController.login);

export default router;