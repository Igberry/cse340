const inventoryModel = require('../models/inventory-model');
const utilities = require('../utilities');
const nav = `
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/inventory">Inventory</a></li>
    <li><a href="/contact">Contact</a></li>
  </ul>
`;

res.render('layouts/layout', {
  title: 'Page Title',
  body: 'Body Content',
  nav, // Pass the nav variable here
});


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
