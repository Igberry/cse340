const pool = require('../database');

// Get vehicle by ID
async function getVehicleById(inv_id) {
    try {
        const sql = 'SELECT * FROM inventory WHERE inv_id = $1';
        const values = [inv_id];
        const result = await pool.query(sql, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

// Get vehicles by classification name (joins inventory with classification table)
async function getVehiclesByClassification(classification) {
    try {
        const sql = `
            SELECT i.* 
            FROM inventory i
            JOIN classification c ON i.classification_id = c.classification_id
            WHERE LOWER(c.classification_name) = LOWER($1)
        `;
        const values = [classification];
        const result = await pool.query(sql, values);
        return result.rows;
    } catch (error) {
        throw error;
    }
}

// Get vehicles by classification ID
async function getInventoryByClassificationId(classification_id) {
    try {
        const sql = "SELECT * FROM inventory WHERE classification_id = $1";
        const result = await pool.query(sql, [classification_id]);
        return result.rows;
    } catch (error) {
        throw error;
    }
}

// Get list of all classifications
async function getClassifications() {
    try {
        const sql = "SELECT classification_id, classification_name FROM classification ORDER BY classification_name ASC";
        const result = await pool.query(sql);
        return result.rows;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getVehicleById,
    getVehiclesByClassification,
    getInventoryByClassificationId,
    getClassifications
};
