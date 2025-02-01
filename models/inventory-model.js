const pool = require("../database"); // Corrected import path

/* ***************************
 * Get all classification data
 **************************** */
async function getClassifications() {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
}

/* ***************************
 * Get vehicle by ID
 **************************** */
async function getVehicleById(id) {
    const query = "SELECT * FROM inventory WHERE id = $1";
    const result = await pool.query(query, [id]);
    return result.rows[0]; // Return single vehicle
}

/* ***************************
 * Insert a new classification
 **************************** */
async function insertClassification(classification_name) {
    const query = "INSERT INTO classification (classification_name) VALUES ($1)";
    await pool.query(query, [classification_name]);
}

/* ***************************
 * Insert a new inventory item
 **************************** */
async function insertInventory(item) {
    const query = "INSERT INTO inventory (classification_id, inv_make, inv_model) VALUES ($1, $2, $3)";
    await pool.query(query, [item.classification_id, item.inv_make, item.inv_model]);
}

/* ***************************
 * Build classification list for dropdown
 **************************** */
async function buildClassificationList() {
    const result = await pool.query("SELECT * FROM classification ORDER BY classification_name");

    let classificationList = `
      <select name="classification_id" id="classificationList" required>
        <option value="">Choose a Classification</option>
        ${result.rows
          .map(
            (row) => `<option value="${row.classification_id}">${row.classification_name}</option>`
          )
          .join("")}
      </select>
    `;
    return classificationList;
}

/* Export all functions properly */
module.exports = {
    getClassifications,
    getVehicleById,
    insertClassification,
    insertInventory,
    buildClassificationList,
};
