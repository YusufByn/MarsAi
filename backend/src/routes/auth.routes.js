import express from 'express';
import * as authController from '../controllers/auth.controller.js';
import validate from '../middlewares/validator/validate.js';
import { juryRegisterSchema, juryLoginSchema } from '../utils/schemas.util.js';
import { authLimiter } from '../middlewares/rateLimiter.middleware.js';

const router = express.Router();

// CHECK TOKEN -> router.use(authMiddleware);

router.use(authLimiter);

router.post('/register', validate(juryRegisterSchema), authController.register);
router.post('/login', validate(juryLoginSchema), authController.login);

export default router;