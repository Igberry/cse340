const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const db = require('../models/accountModel');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Account management view
router.get('/manage', authMiddleware, (req, res) => {
    res.render('account/manage', { user: req.user });
});

// Update account view
router.get('/update', authMiddleware, (req, res) => {
    res.render('account/update', { user: req.user, errors: [] });
});

// Process account update
router.post('/update', authMiddleware, [
    check('firstname').notEmpty().withMessage('First name is required'),
    check('lastname').notEmpty().withMessage('Last name is required'),
    check('email').isEmail().withMessage('Valid email is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('account/update', { user: req.user, errors: errors.array() });
    }

    const { firstname, lastname, email } = req.body;
    try {
        await db.updateAccount(req.user.account_id, { firstname, lastname, email });
        res.redirect('/account/manage?success=Account updated');
    } catch (err) {
        res.render('account/update', { user: req.user, errors: [{ msg: 'Error updating account' }] });
    }
});

// Process password change
router.post('/change-password', authMiddleware, [
    check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('account/update', { user: req.user, errors: errors.array() });
    }

    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        await db.updatePassword(req.user.account_id, hashedPassword);
        res.redirect('/account/manage?success=Password updated');
    } catch (err) {
        res.render('account/update', { user: req.user, errors: [{ msg: 'Error updating password' }] });
    }
});

// Logout route
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

module.exports = router;
