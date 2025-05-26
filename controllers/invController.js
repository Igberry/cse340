const inventoryModel = require('../models/inventory-model');
const utils = require('../utilities'); // for your custom html builder

async function buildDetailView(req, res, next) {
  try {
    const inv_id = req.params.inv_id;
    const vehicle = await inventoryModel.getVehicleById(inv_id);

    if (!vehicle) {
      return res.status(404).render('errors/404', { title: 'Vehicle Not Found' });
    }

    const detailHTML = utils.buildVehicleDetailHTML(vehicle);

    res.render('inventory/vehicle-detail', {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      vehicle: vehicle,
      detailHTML: detailHTML,
    });
  } catch (error) {
    next(error);
  }
}

async function buildByClassificationId(req, res, next) {
  try {
    const classificationId = parseInt(req.params.classification_id);
    const vehicles = await inventoryModel.getInventoryByClassificationId(classificationId);
    const classifications = await inventoryModel.getClassifications();

    let grid = '<ul class="vehicle-list">';
    vehicles.forEach(vehicle => {
      grid += `
        <li>
          <a href="/inv/detail/${vehicle.inv_id}">
            <img src="${vehicle.inv_thumbnail}" alt="${vehicle.inv_make} ${vehicle.inv_model}">
            <h3>${vehicle.inv_make} ${vehicle.inv_model}</h3>
            <p>$${vehicle.inv_price.toLocaleString()}</p>
          </a>
        </li>
      `;
    });
    grid += '</ul>';

    res.render('inventory/classification-view', {
      title: 'Vehicle Listings',
      navList: classifications,
      grid
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  buildDetailView,
  buildByClassificationId
};
