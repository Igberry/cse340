const db = require("../database");

// Get account by account_id
async function getAccountById(account_id) {
  const sql = `
    SELECT account_id, account_firstname, account_lastname, account_email, account_type
    FROM accounts
    WHERE account_id = $1
  `;
  const result = await db.query(sql, [account_id]);
  return result.rows[0];
}

// Check if email exists in another account
async function checkEmailExists(email, currentAccountId) {
  const sql = `
    SELECT account_id
    FROM accounts
    WHERE account_email = $1 AND account_id != $2
  `;
  const result = await db.query(sql, [email, currentAccountId]);
  return result.rows.length > 0;
}

// Update account info
async function updateAccount({ account_id, firstname, lastname, email }) {
  const sql = `
    UPDATE accounts
    SET account_firstname = $1,
        account_lastname = $2,
        account_email = $3
    WHERE account_id = $4
  `;
  const values = [firstname, lastname, email, account_id];
  const result = await db.query(sql, values);
  return result.rowCount > 0;
}

// Update password
async function updatePassword(account_id, hashedPassword) {
  const sql = `
    UPDATE accounts
    SET account_password = $1
    WHERE account_id = $2
  `;
  const result = await db.query(sql, [hashedPassword, account_id]);
  return result.rowCount > 0;
}

// Get account by email (for login + registration)
async function getAccountByEmail(email) {
  const sql = `
    SELECT *
    FROM accounts
    WHERE account_email = $1
  `;
  const result = await db.query(sql, [email]);
  return result.rows[0];
}

// Create new account
async function createAccount({ firstname, lastname, email, password, account_type = "Client" }) {
  const sql = `
    INSERT INTO accounts (
      account_firstname,
      account_lastname,
      account_email,
      account_password,
      account_type
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING account_id
  `;
  const values = [firstname, lastname, email, password, account_type];
  const result = await db.query(sql, values);
  return result.rows[0];
}

module.exports = {
  getAccountById,
  checkEmailExists,
  updateAccount,
  updatePassword,
  getAccountByEmail,
  createAccount
};
