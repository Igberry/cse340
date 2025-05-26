const pool = require("../database");

async function getNavList() {
  try {
    const result = await pool.query("SELECT * FROM classification ORDER BY classification_name");
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
      <img src="${vehicle.inv_image_full}" alt="${vehicle.inv_make} ${vehicle.inv_model}" class="vehicle-image" />
      <div class="vehicle-info">
        <h2>${vehicle.inv_make} ${vehicle.inv_model} (${vehicle.inv_year})</h2>
        <p><strong>Price:</strong> ${price}</p>
        <p><strong>Mileage:</strong> ${mileage} miles</p>
        <p>${vehicle.inv_description}</p>
      </div>
    </div>
  `;
}

module.exports = {
  buildVehicleDetailHTML,
  getNavList,
};
