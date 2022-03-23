const { body } = require('express-validator');

module.exports = [
    body('name')
        .isString()
        .withMessage('Name cannot be blank'),
    body('email')
        .isEmail()
        .withMessage('Invalid Email entered'),
    body('password', 'Password should be combination of one uppercase , one lower case, one special char, one digit and min 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, "i"),
]