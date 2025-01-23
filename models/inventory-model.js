const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

module.exports = {getClassifications}

const db = require('../database');

exports.getVehicleById = async (id) => {
  const query = 'SELECT * FROM inventory WHERE id = $1';
  const result = await db.query(query, [id]);
  return result.rows[0];
};
