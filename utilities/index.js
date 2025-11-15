const pool = require("../database");
const inventoryModel = require('../models/inventory-model');

async function buildClassificationList() {
  try {
    const classifications = await inventoryModel.getClassifications();
    let list = '<select name="classification_id" id="classification_id">';
    list += '<option value="">Choose a classification</option>';
    classifications.forEach(c => {
      list += `<option value="${c.classification_id}">${c.classification_name}</option>`;
    });
    list += '</select>';
    return list;
  } catch (error) {
    throw error;
  }
}
async function injectNav(req, res, next) {
  try {
    const navList = await getNavList();
    res.locals.navList = navList;
    next();
  } catch (err) {
    console.error("Nav injection error:", err);
    next(); // fail silently
  }
}

async function getNavList() {
  try {
    const result = await pool.query("SELECT * FROM classification ORDER BY classification_name");
    console.log (result.rows)
    return result.rows;
  } catch (error) {
    console.error("Error building nav list:", error);
    throw error;
  }
}

function buildVehicleDetailHTML(vehicle) {
  const price = vehicle.inv_price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  const mileage = vehicle.inv_miles.toLocaleString();

  return `
    <div class="vehicle-detail">
      <img src="${vehicle.inv_image}" alt="${vehicle.inv_make} ${vehicle.inv_model}" class="vehicle-image" />
      <div class="vehicle-info">
        <h2>${vehicle.inv_make} ${vehicle.inv_model} (${vehicle.inv_year})</h2>
        <p><strong>Price:</strong> ${price}</p>
        <p><strong>Mileage:</strong> ${mileage} miles</p>
        <p>${vehicle.inv_description}</p>
      </div>
    </div>
  `;
}
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    next()
  } else {
    req.flash("error", "Please log in to continue")
    res.redirect("/account/login")
  }
}
module.exports = {
  buildVehicleDetailHTML,
  getNavList,
  isAuthenticated,
  buildClassificationList,
  injectNav
};
