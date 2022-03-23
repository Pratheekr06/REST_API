const express = require('express');
const router = express.Router();

const userController = require('../controller/auth');
const userValidation = require('../validation/userValidation');

router.post('/login', userController.login);

router.post('/signup', userValidation, userController.signup);

module.exports = router;