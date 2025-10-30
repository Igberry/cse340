const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const accountsController = require('../controllers/accountsController');
const { checkEmailExists } = require('../models/accountsModel');
const { isAuthenticated, requireEmployeeOrAdmin } = require('../middleware/auth'); // ✅ both middleware

// ======== Public Routes ======== //

// View login page
router.get('/login', accountsController.loginView);

// Handle login form submission
router.post('/login', accountsController.processLogin);

// View registration page
router.get('/register', accountsController.registerView);

// Handle registration form submission with validation
router.post(
  '/register',
  [
    body('firstname').notEmpty().withMessage('First name is required'),
    body('lastname').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
  accountsController.processRegistration
);

// View user account (login required)
router.get('/', isAuthenticated, accountsController.accountView);

// ======== Protected Routes ======== //

// Account management page
router.get('/manage', isAuthenticated, accountsController.manageAccount);

// View account update form
router.get('/update/:account_id', isAuthenticated, accountsController.updateAccountView);

// Handle account info update
router.post(
  '/update',
  isAuthenticated,
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

// Handle password update
router.post(
  '/update-password',
  isAuthenticated,
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

// Logout
router.get('/logout', accountsController.logout);

// ======== Admin or Employee-Only Example ======== //
// Uncomment below when needed for role-based protection
// router.get('/admin-panel', requireEmployeeOrAdmin, accountsController.adminPanelView);

module.exports = router;
