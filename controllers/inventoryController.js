const inventoryModel = require('../models/inventory-model');
const utilities = require('../utilities');

exports.getVehicleDetails = async (req, res, next) => {
  try {
    const vehicleId = req.params.id;
    const vehicleData = await inventoryModel.getVehicleById(vehicleId);

    if (!vehicleData) {
      return res.status(404).render('errors/404', { title: 'Not Found' });
    }

    const htmlContent = utilities.buildVehicleDetailsHTML(vehicleData);
    res.render('inventory/details', {
      title: `${vehicleData.make} ${vehicleData.model}`,
      content: htmlContent,
    });
  } catch (err) {
    next(err);
  }
};
