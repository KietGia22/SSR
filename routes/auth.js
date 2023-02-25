const express = require('express');

const { check, body } = require('express-validator/check');

const authController = require('../controllers/auth');

const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login',
    [
        body('email')
        .isEmail()
        .withMessage('Please enter a valid email address'),
        body('password')
        .isLength({min: 5, max: 12})
        .isAlphanumeric()
        .trim()
    ] 
        ,authController.postLogin
    );

router.post(
    '/signup',
    [check('email')
    .isEmail()
    .withMessage('please enter a valid email')
    .normalizeEmail()
    .custom((value, {req}) => {
        // if(value === 'test@test.com') {
        //     throw new Error('this email address is forbidden');
        // }
        // return true;

        // email address on the right side here is the right side is the value of course which you are validating 
        // because we're doing this on the email field, so value will be the entered email
        return User.findOne({ email: value })
        .then((userDoc) => {  
            if (userDoc) {
                //A promise is a buldt-in js object and with reject,
                //I basically throw an error inside of the promise and I reject with this error message I used before 
                return Promise.reject('Email exists already, please pick a different one');
            }
        })
    })
    .normalizeEmail(),
    body('password',
    'Please enter a password with only numbers and text and at least 5 character'
    )
    .isLength({min: 5, max: 12})
    .isAlphanumeric()
    .trim(),
    body('confirmPassword')
    .trim()
    .custom((value, {req}) => {
        if(value !== req.body.password){
            throw new Error('Passwords have to match!');
        }
        return true;
    })
],
    authController.postSignup,
);

router.post('/logout', authController.postLogout);

// router.get('/reset', authController.getReset);

// router.post('/reset', authController.postReset);

// router.get('/reset/:token', authController.getNewPassword);

// router.post('/new-password', authController.postNewPassword);

module.exports = router;
