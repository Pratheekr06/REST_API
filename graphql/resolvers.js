const User = require('../models/user');
const validator = require('validator');

module.exports = {
    hello: function() {
        return {
            text: 'hello',
            views: 10
        };
    },
    userCreate: async function(args, req) {
        const errors = [];
        if (!validator.isString(args.userInput.name) || !validator.isLength(args.userInput.name), { min: 3 }) {
            errors.push({
                message: 'Invalid User Name'
            })
        }
        if (!validator.isEmail(args.userInput.email)) {
            errors.push({
                message: 'Invalid email id'
            })
        }
        if (validator.isEmpty(args.userInput.password) || !validator.isLength(args.userInput.password), { min: 5 }) {
            errors.push({
                message: 'Password not valid'
            })
        }
        
        const user = await User.findOne({ email: args.userInput.email});
        if (user) {
            errors.push({
                message: 'User already exists'
            })
        }
        if (errors.length > 0) {
            const error = new Error('Invalid input.');
            error.data = errors;
            error.code = 422;
            throw error;
          }
        const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
        const newUser = new User({
            name: args.userInput.name,
            email: args.userInput.email,
            password: hashedPassword,
        })
        const createdUser = await newUser.save();
        return { ...createdUser._doc, _id: createdUser._id.toString() };
    },
};