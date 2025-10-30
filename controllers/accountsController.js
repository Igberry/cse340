const { validationResult } = require('express-validator');
const accountsModel = require('../models/accountsModel');
const bcrypt = require('bcryptjs');
const db = require("../database");


exports.loginView = (req, res) => {
    res.render('account/login', { message: null });
};
exports.processLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Look up account by email
        const sql = "SELECT * FROM accounts WHERE email = $1";
        const result = await db.query(sql, [email]);
        const account = result.rows[0];

        if (!account) {
            // No account found
            return res.status(401).render("account/login", {
                title: "Login",
                message: "Invalid email or password.",
            });
        }

        // Compare provided password with hashed password
        const match = await bcrypt.compare(password, account.password);

        if (!match) {
            return res.status(401).render("account/login", {
                title: "Login",
                message: "Invalid email or password.",
            });
        }

        // ✅ Store login state and name for header
        req.session.loggedin = true;
        req.session.firstname = account.firstname;

        req.session.user = {
            id: account.account_id,
            name: account.firstname,
            email: account.email,
            type: account.account_type,
        };

        // ✅ Flash welcome message
        req.flash("success", `Welcome back, ${account.firstname}! You have successfully logged in.`);

        // ✅ Redirect to home or dashboard
        res.redirect("/");
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).render("account/login", {
            title: "Login",
            message: "An error occurred. Please try again.",
        });
    }
};

exports.registerView = (req, res) => {
    res.render('account/register', { errors: [], message: null });
};

exports.processRegistration = async (req, res) => {
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
            account_type: 'client' // or whatever default type you want
        });

        if (newAccount) {
            // Redirect to login page after successful registration
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
exports.registerAccount = async (req, res) => {
    const { firstname, lastname, email, password } = req.body;

    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Call model to insert new user
        const result = await accountsModel.registerAccount({
            firstname,
            lastname,
            email,
            password: hashedPassword,
        });

        if (result) {
            req.flash("notice", "Registration successful. You can now log in.");
            res.redirect("/account/login");
        } else {
            req.flash("notice", "Registration failed. Please try again.");
            res.redirect("/account/register");
        }
    } catch (err) {
        console.error("Registration error:", err.message);
        req.flash("notice", "An error occurred. Please try again.");
        res.redirect("/account/register");
    }
};
exports.accountView = (req, res) => {
    if (req.session && req.session.user) {
        // User is logged in, show account page (you can render account details page here)
        res.render('account/account', { account: req.session.user });
    } else {
        // User not logged in, show login page instead
        res.render('account/login', { message: null });
    }
};


exports.manageAccount = async (req, res) => {
    try {
        // Use account info from res.locals or req.account
        const account = res.locals.account;
        if (!account) {
            return res.redirect('/account/login');
        }
        // Get full fresh account info from DB by account_id
        const fullAccount = await accountsModel.getAccountById(account.account_id);
        res.render('account/manage', { account: fullAccount, message: null });
    } catch (err) {
        res.status(500).send('Server error');
    }
};

exports.updateAccountView = async (req, res) => {
    try {
        const account_id = req.params.account_id;
        const account = await accountsModel.getAccountById(account_id);
        if (!account) {
            return res.redirect('/account/manage');
        }
        res.render('account/update', { account, errors: [], message: null });
    } catch (err) {
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
            const updatedAccount = await accountsModel.getAccountById(account_id);
            res.render('account/manage', {
                account: updatedAccount,
                message: 'Account information updated successfully.',
            });
        } else {
            res.render('account/update', {
                account: { account_id, firstname, lastname, email },
                errors: [],
                message: 'Failed to update account information.',
            });
        }
    } catch (err) {
        res.status(500).send('Server error');
    }
};

exports.processPasswordUpdate = async (req, res) => {
    const errors = validationResult(req);
    const { newpassword, account_id } = req.body;

    if (!errors.isEmpty()) {
        const account = await accountsModel.getAccountById(account_id);
        return res.render('account/update', {
            account,
            errors: errors.array(),
            message: null,
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(newpassword, 10);
        const result = await accountsModel.updatePassword(account_id, hashedPassword);
        if (result) {
            const updatedAccount = await accountsModel.getAccountById(account_id);
            res.render('account/manage', {
                account: updatedAccount,
                message: 'Password updated successfully.',
            });
        } else {
            const account = await accountsModel.getAccountById(account_id);
            res.render('account/update', {
                account,
                errors: [],
                message: 'Failed to update password.',
            });
        }
    } catch (err) {
        res.status(500).send('Server error');
    }
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Logout error:", err);
        }
        res.redirect("/");
    });
};

