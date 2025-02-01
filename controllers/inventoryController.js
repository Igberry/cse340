const inventoryModel = require('../models/inventory-model');
const utilities = require('../utilities');

const inventoryController = {};

// Navigation for layout
const nav = `
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/inventory">Inventory</a></li>
    <li><a href="/contact">Contact</a></li>
  </ul>
`;

// Render the layout for pages
inventoryController.showPage = (req, res) => {
  res.render('layouts/layout', {
    title: 'Page Title',
    body: 'Body Content',
    nav: nav, // Ensure nav is passed to the layout here
  });
};


/* ***************************
 * Get Vehicle Details
 **************************** */
inventoryController.getVehicleDetails = async (req, res, next) => {
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

/* ***************************
 * Render Management View
 **************************** */
inventoryController.showManagementView = (req, res) => {
  res.render("inventory/management", {
    title: "Inventory Management",
    messages: req.flash("info"), // Flash message support
  });
};

/* ***************************
 * Show Add Classification View
 **************************** */
inventoryController.showAddClassification = (req, res) => {
  res.render("inventory/add-classification", {
    title: "Add Classification",
    messages: req.flash("error"),
  });
};

/* ***************************
 * Add Classification
 **************************** */
inventoryController.addClassification = async (req, res) => {
  const { classification_name } = req.body;

  // Server-side validation
  if (!/^[a-zA-Z0-9]+$/.test(classification_name)) {
    req.flash("error", "Invalid classification name.");
    return res.redirect("/inv/add-classification");
  }

  try {
    await inventoryModel.insertClassification(classification_name);
    req.flash("info", "Classification added successfully.");
    res.redirect("/inv/");
  } catch (error) {
    req.flash("error", "Error adding classification.");
    res.redirect("/inv/add-classification");
  }
};

/* ***************************
 * Show Add Inventory View
 **************************** */
inventoryController.showAddInventory = async (req, res) => {
  const classificationList = await inventoryModel.buildClassificationList();
  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    classificationList,
    messages: req.flash("error"),
  });
};

/* ***************************
 * Add Inventory Item
 **************************** */
inventoryController.addInventory = async (req, res) => {
  const { classification_id, inv_make, inv_model } = req.body;

  if (!classification_id || !inv_make || !inv_model) {
    req.flash("error", "All fields are required.");
    return res.redirect("/inv/add-inventory");
  }

  try {
    await inventoryModel.insertInventory({ classification_id, inv_make, inv_model });
    req.flash("info", "Inventory item added successfully.");
    res.redirect("/inv/");
  } catch (error) {
    req.flash("error", "Error adding item.");
    res.redirect("/inv/add-inventory");
  }
};

module.exports = inventoryController;
