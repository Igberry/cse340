const { validationResult } = require('express-validator');
const accountsModel = require('../models/accountsModel');
const bcrypt = require('bcryptjs');
const db = require("../database");
const jwt = require('jsonwebtoken');

exports.loginView = (req, res) => {
    res.render('account/login', {
        title: "Login",
        message: null,
    });
};

exports.processLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const sql = "SELECT * FROM accounts WHERE account_email = $1";
        const result = await db.query(sql, [email]);
        const account = result.rows[0];
        console.log("Account fetched for login:", account);

        if (!account) {
            return res.status(401).render('account/login', {
                title: "Login",
                message: "Invalid email or password.",
            });
        }

        const match = await bcrypt.compare(password, account.account_password);
        if (!match) {
            return res.status(401).render("account/login", {
                title: "Login",
                message: "Invalid email or password.",
            });
        }

        // Store session info
        req.session.loggedin = true;
        req.session.firstname = account.account_firstname;

        req.session.user = {
            account_id: account.account_id,
            firstname: account.account_firstname,
            email: account.account_email,
            account_type: account.account_type,
        };

        // JWT token
        try {
            const payload = {
                account_id: account.account_id,
                firstname: account.account_firstname,
                account_type: account.account_type,
            };
            const token = jwt.sign(payload, process.env.JWT_SECRET || 'devsecret', { expiresIn: '2h' });
            res.cookie('jwt', token, { httpOnly: true, maxAge: 2 * 60 * 60 * 1000 });
        } catch (err) {
            console.error('JWT sign error:', err);
        }

        // Flash message
        req.flash("success", `Welcome back, ${account.account_firstname}! You have successfully logged in.`);

        res.render('account/account', { 
            title: "Account Dashboard",
            account: req.session.user,
            message: req.flash("success")[0]
        });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).render('account/login', {
            title: "Login",
            message: "An error occurred. Please try again.",
        });
    }
};

exports.registerView = (req, res) => {
    res.render('account/register', { errors: [], message: null });
};

exports.processRegistration = async (req, res) => {
    console.log("Processing registration with data:", req.body);
    const errors = validationResult(req);
    const { firstname, lastname, email, password } = req.body;

    if (!errors.isEmpty()) {
        return res.render('account/register', {
            errors: errors.array(),
            message: null,
            account: { firstname, lastname, email }
        });
    }

    try {
        const existingAccount = await accountsModel.getAccountByEmail(email);
        if (existingAccount) {
            return res.render('account/register', {
                errors: [],
                message: 'Email already exists. Please use a different email.',
                account: { firstname, lastname, email }
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAccount = await accountsModel.createAccount({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            account_type: 'client'
        });

        if (newAccount) {
            return res.redirect('/account/login');
        } else {
            res.render('account/register', {
                errors: [],
                message: 'Registration failed. Please try again.',
                account: { firstname, lastname, email }
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

exports.accountView = (req, res) => {
    if (req.session && req.session.user) {
        res.render('account/account', { account: req.session.user });
    } else {
        res.render('account/login', { message: null });
    }
};

exports.manageAccount = async (req, res) => {
    try {
        const account = res.locals.account || req.session.user;
        if (!account) return res.redirect('/account/login');

        const fullAccount = await accountsModel.getAccountById(account.account_id);
        res.locals.account = fullAccount;

        const message = req.flash('success')[0] || null;

        res.render('account/manage', {
            account: fullAccount,
            message
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

exports.updateAccountView = async (req, res) => {
    try {
        const account_id = req.params.account_id;
        const account = await accountsModel.getAccountById(account_id);
        if (!account) return res.redirect('/account/manage');

        res.locals.account = account;
        res.render('account/update', { account, errors: [], message: null });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

exports.processAccountUpdate = async (req, res) => {
    const errors = validationResult(req);
    const { firstname, lastname, email, account_id } = req.body;

    if (!errors.isEmpty()) {
        return res.render('account/update', {
            account: { account_id, firstname, lastname, email },
            errors: errors.array(),
            message: null,
        });
    }

    try {
        const result = await accountsModel.updateAccount({ account_id, firstname, lastname, email });
        if (result) {
            // Fetch the updated account info
            const updatedAccount = await accountsModel.getAccountById(account_id);

            // Update session and res.locals for consistent display
            req.session.user = updatedAccount;
            res.locals.account = updatedAccount;

            req.flash('success', 'Account information updated successfully.');
            res.render('account/manage', {
                account: updatedAccount,
                message: req.flash('success')[0]
            });
        } else {
            res.render('account/update', {
                account: { account_id, firstname, lastname, email },
                errors: [],
                message: 'Failed to update account information.',
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

exports.processPasswordUpdate = async (req, res) => {
    const errors = validationResult(req);
    const { newpassword, account_id } = req.body;

    if (!errors.isEmpty()) {
        const account = await accountsModel.getAccountById(account_id);
        return res.render('account/update', { account, errors: errors.array(), message: null });
    }

    try {
        const hashedPassword = await bcrypt.hash(newpassword, 10);
        const result = await accountsModel.updatePassword(account_id, hashedPassword);

        if (result) {
            const updatedAccount = await accountsModel.getAccountById(account_id);

            // Update session and res.locals for consistent display
            req.session.user = updatedAccount;
            res.locals.account = updatedAccount;

            req.flash('success', 'Password updated successfully.');
            res.render('account/manage', {
                account: updatedAccount,
                message: req.flash('success')[0]
            });
        } else {
            const account = await accountsModel.getAccountById(account_id);
            res.render('account/update', {
                account,
                errors: [],
                message: 'Failed to update password.'
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};


exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) console.error("Logout error:", err);
        res.clearCookie('jwt');
        res.redirect("/");
    });
};
