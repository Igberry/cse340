const invModel = require("../models/inventory-model");
const Util = {};

/* ************************
 * Constructs the navigation menu as an HTML unordered list
 ************************** */
Util.getNav = async function () {
  try {
    let data = await invModel.getClassifications();
    let list = `
      <ul>
        <li><a href="/" title="Home page">Home</a></li>
        ${data.rows
          .map(
            (row) => `
          <li>
            <a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">
              ${row.classification_name}
            </a>
          </li>
        `
          )
          .join("")}
      </ul>
    `;
    return list;
  } catch (error) {
    console.error("Error fetching classifications:", error);
    return "<ul><li>Error loading navigation</li></ul>";
  }
};

/* ************************
 * Builds the vehicle details HTML
 ************************** */
Util.buildVehicleDetailsHTML = (vehicle) => {
  // Ensure vehicle properties exist to avoid errors
  const make = vehicle.make ? Util.escapeHTML(vehicle.make) : "Unknown Make";
  const model = vehicle.model ? Util.escapeHTML(vehicle.model) : "Unknown Model";
  const year = vehicle.year || "N/A";
  const price = vehicle.price ? `$${vehicle.price.toLocaleString()}` : "N/A";
  const mileage = vehicle.mileage ? `${vehicle.mileage.toLocaleString()} miles` : "N/A";
  const description = vehicle.description ? Util.escapeHTML(vehicle.description) : "No description available.";
  const image = vehicle.image_full || "/images/no-image.png"; // Default image if missing

  return `
    <div class="vehicle-details">
      <h1>${make} ${model}</h1>
      <img src="${image}" alt="${make} ${model}" />
      <p><strong>Year:</strong> ${year}</p>
      <p><strong>Price:</strong> ${price}</p>
      <p><strong>Mileage:</strong> ${mileage}</p>
      <p><strong>Description:</strong> ${description}</p>
    </div>
  `;
};

/* ************************
 * Escapes HTML to prevent XSS attacks
 ************************** */
Util.escapeHTML = (str) => {
  return str.replace(/[&<>"']/g, (match) => {
    const escapeMap = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
    return escapeMap[match];
  });
};

module.exports = Util;
