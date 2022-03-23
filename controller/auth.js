const User = require('../models/user');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const generateToken = require('../util/generateToken');

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation Error, Entered data is invalid');
        error.statusCode = 422;
        throw error;
    }
    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'User not found, pls enter valid credentials'})
            }
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials'})
                    generateToken(res, user);
                })
                .catch(err => {
                    if (!err.statusCode) err.statusCode = 500;
                    next(err);
                })
        })
};

exports.signup = async (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation Error, Entered data is invalid');
        error.statusCode = 422;
        throw error;
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    User.findOne({ email, name })
        .then(user => {
            if (user) {
                return res.status(409).json({ message: 'User already exists'});
            }
            const newUser = new User({
                name: name,
                email: email,
                password: hashedPassword,
            })
            return newUser.save();
        })
        .then(response => {
            res.status(200).json({ message: 'User Signup Successfull', user: response})
        })
        .catch(err => {
            if (!err.statusCode) err.statusCode = 500;
            next(err);
        })
}