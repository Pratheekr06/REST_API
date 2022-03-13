const { body} = require('express-validator');

module.exports = [
    body('title')
    .trim()
    .isString()
    .isLength({min: 5}),
    body('content')
    .trim()
    .isString()
    .isLength({min: 5})
];