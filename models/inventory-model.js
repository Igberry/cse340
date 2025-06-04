const pool = require('../database');

// Get all vehicles
async function getAllVehicles() {
    try {
        const sql = 'SELECT * FROM inventory ORDER BY inv_make';
        const result = await pool.query(sql);
        return result.rows;
    } catch (error) {
        throw error;
    }
}

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
async function getVehiclesByClassification(classification_name) {
    const sql = `
        SELECT i.* FROM inventory i
        JOIN classification c ON i.classification_id = c.classification_id
        WHERE c.classification_name = $1
    `;
    const result = await pool.query(sql, [classification_name]);
    return result.rows;
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

// Add classification
async function addClassification(classification_name) {
    try {
        const sql = 'INSERT INTO classification (classification_name) VALUES ($1)';
        const result = await pool.query(sql, [classification_name]);
        return result.rowCount;
    } catch (error) {
        throw error;
    }
}

// Get vehicles by classification ID
async function getInventoryByClassificationId(classification_id) {
    try {
        const sql = "SELECT * FROM inventory WHERE classification_id = $1";
        const values = [classification_id];
        const result = await pool.query(sql, values);
        return result.rows;
    } catch (error) {
        throw error;
    }
}

// Add inventory item
async function addInventory(data) {
    try {
        const sql = `
      INSERT INTO inventory 
      (classification_id, inv_make, inv_model, inv_description, inv_price,
       inv_year, inv_miles, inv_image, inv_thumbnail, inv_color)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    `;
        const params = [
            data.classification_id,
            data.inv_make,
            data.inv_model,
            data.inv_description,
            data.inv_price,
            data.inv_year,
            data.inv_miles,
            data.inv_image,
            data.inv_thumbnail,
            data.inv_color
        ];
        const result = await pool.query(sql, params);
        return result.rowCount;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getAllVehicles,
    getVehicleById,
    getVehiclesByClassification,
    getInventoryByClassificationId,
    getClassifications,
    addClassification,
    addInventory
};
