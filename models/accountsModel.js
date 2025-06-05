// Profile Model
const pool = require("../database");

// Get account by account_id
async function getAccountById(account_id) {
    const sql = 'SELECT account_id, firstname, lastname, email, account_type FROM accounts WHERE account_id = $1';
    const values = [account_id];
    const result = await pool.query(sql, values);
    return result.rows[0];
}

// Check if email exists in another account
async function checkEmailExists(email, currentAccountId) {
    const sql = 'SELECT account_id FROM accounts WHERE email = $1 AND account_id != $2';
    const values = [email, currentAccountId];
    const result = await pool.query(sql, values);
    return result.rows.length > 0;
}

// Update account info (firstname, lastname, email)
async function updateAccount({ account_id, firstname, lastname, email }) {
    const sql = `
    UPDATE accounts SET firstname = $1, lastname = $2, email = $3
    WHERE account_id = $4
  `;
    const values = [firstname, lastname, email, account_id];
    const result = await pool.query(sql, values);
    return result.rowCount > 0;
}

// Update password hash
async function updatePassword(account_id, hashedPassword) {
    const sql = 'UPDATE accounts SET password = $1 WHERE account_id = $2';
    const values = [hashedPassword, account_id];
    const result = await pool.query(sql, values);
    return result.rowCount > 0;
}

// Get account by email (used for registration and login)
async function getAccountByEmail(email) {
    const sql = 'SELECT * FROM accounts WHERE email = $1';
    const values = [email];
    const result = await pool.query(sql, values);
    return result.rows[0];
}

// Create new account (registration)
async function createAccount({ firstName, lastName, email, password, account_type = 'Client' }) {
    const sql = `
        INSERT INTO accounts (first_name, last_name, email, password, account_type)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING account_id
    `;
    const values = [firstName, lastName, email, password, account_type];
    const result = await pool.query(sql, values);
    return result.rows[0];
}

async function registerAccount({ firstname, lastname, email, password }) {
    const sql = `
        INSERT INTO accounts (first_name, last_name, email, password, account_type)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING account_id
    `;
    const values = [firstName, lastName, email, password, account_type];
    const result = await pool.query(sql, values);
    return result.rows[0];
}
module.exports = {
    getAccountById,
    checkEmailExists,
    updateAccount,
    updatePassword,
    getAccountByEmail,
    createAccount,
    registerAccount,
};
