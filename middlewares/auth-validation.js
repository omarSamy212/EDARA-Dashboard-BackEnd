const { body } = require('express-validator');

const emailValidation = body("email").isEmail().withMessage("Please enter valid email");
const passwordValidation = body("password").isLength({min: 8, max: 16}).withMessage("Password should be from 8 to 16");
const usernameValidation = body("password").isString().notEmpty().withMessage("Enter a valid username");

module.exports = 
{
    isEmail: emailValidation,
    isPassword: passwordValidation,
    isUsername: usernameValidation
}