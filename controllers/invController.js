const inventoryModel = require('../models/inventory-model');
const utils = require('../utilities');

// Define all controller functions first
const buildAddClassification = async (req, res, next) => {
  const nav = await utils.getNav();
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: [],
  });
};

const addClassification = async (req, res, next) => {
  const { classification_name } = req.body;
  const nav = await utils.getNav();

  try {
    const result = await inventoryModel.addClassification(classification_name);
    if (result) {
      req.flash("message", "Classification added successfully.");
      res.redirect("/inv");
    } else {
      req.flash("message", "Failed to add classification.");
      res.redirect("/inv/add-classification");
    }
  } catch (error) {
    next(error);
  }
};

const buildManagement = async (req, res, next) => {
  try {
    const nav = await utils.getNav();
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      message: req.flash("message")
    });
  } catch (err) {
    next(err);
  }
};

const buildAddInventory = async (req, res, next) => {
  const nav = await utils.getNav();
  const classificationList = await utils.buildClassificationList();
  res.render("inventory/add-inventory", {
    title: "Add Vehicle",
    nav,
    classificationList,
    errors: [],
    inv_make: "", inv_model: "", inv_description: "", inv_price: "", inv_year: "", inv_miles: "", inv_image: "", inv_thumbnail: "", inv_color: ""
  });
};

const addInventory = async (req, res, next) => {
  const {
    classification_id, inv_make, inv_model, inv_description,
    inv_price, inv_year, inv_miles, inv_image, inv_thumbnail, inv_color
  } = req.body;

  try {
    const result = await inventoryModel.addInventory({
      classification_id, inv_make, inv_model, inv_description,
      inv_price, inv_year, inv_miles, inv_image, inv_thumbnail, inv_color
    });

    if (result) {
      req.flash("message", "Vehicle added successfully.");
      res.redirect("/inv");
    } else {
      throw new Error("Insert failed.");
    }
  } catch (err) {
    const nav = await utils.getNav();
    const classificationList = await utils.buildClassificationList(classification_id);
    res.render("inventory/add-inventory", {
      title: "Add Vehicle",
      nav,
      classificationList,
      errors: [{ msg: err.message }],
      ...req.body
    });
  }
};

const buildDetailView = async (req, res, next) => {
  try {
    const inv_id = req.params.inv_id;
    const vehicle = await inventoryModel.getVehicleById(inv_id);

    if (!vehicle) {
      return res.status(404).render('errors/404', { title: 'Vehicle Not Found' });
    }

    const detailHTML = utils.buildVehicleDetailHTML(vehicle);

    res.render('inventory/vehicle-detail', {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      vehicle,
      detailHTML,
    });
  } catch (error) {
    next(error);
  }
};

const buildByClassificationId = async (req, res, next) => {
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
};

const getInventory = (req, res) => {
  res.render("inventory");
};

// ✅ Export all functions at once
module.exports = {
  buildAddClassification,
  addClassification,
  buildManagement,
  buildAddInventory,
  addInventory,
  buildDetailView,
  buildByClassificationId,
  getInventory
};
