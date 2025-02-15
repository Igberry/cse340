// Profile Model
const db = require("../config/db");

async function createProfile(accountId) {
    const query = `INSERT INTO profiles (account_id) VALUES ($1) RETURNING *`;
    const values = [accountId];
    const result = await db.query(query, values);
    return result.rows[0];
}

async function updateProfile(accountId, bio, profilePicture, socialLinks) {
    const query = `UPDATE profiles SET bio=$1, profile_picture=$2, social_links=$3 WHERE account_id=$4 RETURNING *`;
    const values = [bio, profilePicture, JSON.stringify(socialLinks), accountId];
    const result = await db.query(query, values);
    return result.rows[0];
}

async function getProfile(accountId) {
    const query = `SELECT * FROM profiles WHERE account_id = $1`;
    const values = [accountId];
    const result = await db.query(query, values);
    return result.rows[0];
}

module.exports = { createProfile, updateProfile, getProfile };
