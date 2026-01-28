const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');

const validate = require('../middlewares/validator/validate');

const { juryRegisterShema, juryLoginShema } = require('../utils/schemas');

router.post('/api/auth/register', validate(juryRegisterShema), authController.register);

router.post('/api/auth/login', validate(juryLoginShema), authController.login);

module.exports = router;