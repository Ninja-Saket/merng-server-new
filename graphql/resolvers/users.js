const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');
const User = require('../../models/User');
const { SECRET_KEY } = require('../../config');
const { validateRegisterInput, validateLoginInput } = require('../../util/validators');

function generateToken(user) {
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
    }, SECRET_KEY, { expiresIn: '1h'});
}
module.exports = {
    Mutation: {
        async login(_, { username, password }){
            const {valid, errors} = validateLoginInput(username, password);
            if(!valid) {
                throw new UserInputError('Errors', errors);
            }

            const user = await User.findOne( {username});
            if(!user) {
                errors.general = 'User not found'
                throw new UserInputError('User not found', { errors });
            }
            const match = await bcrypt.compare(password, user.password);
            if(!match) {
                errors.general = 'Wrong Credentials'
                throw new UserInputError('Wrong Credentials', { errors });
            }

            const token = generateToken(user);

            return {
                ...user._doc,
                id: user._id,
                token
            }
        },
        async register(_, {registerInput : { username, email, password, confirmPassword} }, context, info) {
            //  Validate the user data
            const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword);
            if(!valid) {
                throw new UserInputError('Errors', {errors});
            }
            //  Check if the user already exists
            const user = await User.findOne( { username });
            if(user) {
                throw new UserInputError('Username is taken', {
                    errors: {
                        username: 'This username is taken'
                    }
                });
            }
            //  Hash the password and create the auth token
            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            });

            const res = await newUser.save();

            const token = generateToken(res);

            return {
                ...res._doc,
                id: res._id,
                token
            }
        }
    }
}