const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const accountsController = require('../controllers/accountsController');
const { checkEmailExists } = require('../models/accountsModel');
const { isAuthenticated } = require('../middleware/auth');

router.get('/account', accountsController.accountView);
console.log('typeof isAuthenticated:', typeof isAuthenticated);
router.get('/login', accountsController.loginView);
// Handle login form submission
router.post('/login', accountsController.processLogin);
router.get('/register', accountsController.registerView);
// Handle registration form submission with validation
router.post('/register',
    // Example validations
    body('firstname').notEmpty().withMessage('First name is required'),
    body('lastname').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

    accountsController.processRegistration
);

// GET account management
router.get('/manage', accountsController.manageAccount);

// GET account update view (pass id param)
router.get('/update/:account_id', accountsController.updateAccountView);

// POST account update form
router.post(
    '/update',
    [
        body('firstname').trim().notEmpty().withMessage('First name is required.'),
        body('lastname').trim().notEmpty().withMessage('Last name is required.'),
        body('email')
            .trim()
            .isEmail()
            .withMessage('Valid email required.')
            .custom(async (email, { req }) => {
                const exists = await checkEmailExists(email, req.body.account_id);
                if (exists) {
                    return Promise.reject('Email already in use.');
                }
            }),
    ],
    accountsController.processAccountUpdate
);

// POST password update
router.post(
    '/update-password',
    [
        body('newpassword')
            .trim()
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters.')
            .matches(/[a-z]/)
            .withMessage('Password must contain a lowercase letter.')
            .matches(/[A-Z]/)
            .withMessage('Password must contain an uppercase letter.')
            .matches(/\d/)
            .withMessage('Password must contain a digit.'),
    ],
    accountsController.processPasswordUpdate
);

// GET logout
router.get('/logout', accountsController.logout);

module.exports = router;
