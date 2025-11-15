const inventoryModel = require('../models/inventory-model');
const utils = require('../utilities');

const buildAddClassification = async (req, res, next) => {
  try {
    const nav = await utils.getNavList();
    const messages = req.flash("message");
    const vehicles = await inventoryModel.getAllVehicles();

    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      messages,
      vehicles,
    });
  } catch (error) {
    next(error);
  }
};



const addClassification = async (req, res, next) => {
  const { classification_name } = req.body;
  const nav = await utils.getNavList();

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
    const nav = await utils.getNavList();
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      messages: req.flash("message")
    });
  } catch (err) {
    next(err);
  }
};

const buildAddInventory = async (req, res, next) => {
  const nav = await utils.getNavList();
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
    const nav = await utils.getNavList();
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
  const inv_id = req.params.inv_id;
  console.log("Getting detail view for inv_id:", inv_id);

  try {
    const vehicle = await inventoryModel.getVehicleById(inv_id);
    console.log("Vehicle found:", vehicle);

    if (!vehicle) {
      return res.status(404).render("errors/error", { title: "Vehicle Not Found" });
    }

    res.render("inventory/details", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      vehicle,
    });
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    next(error);
  }
};

const classificationHandler = (classification) => async (req, res, next) => {
  try {
    const vehicles = await inventoryModel.getVehiclesByClassificationName(classification);
    const title = `Vehicles - ${classification.charAt(0).toUpperCase() + classification.slice(1)}`;

    if (!vehicles || vehicles.length === 0) {
      return res.render('inventory/no-vehicles', { classification, title });
    }

    // Prepare vehicle grid HTML
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

    res.render('inventory/classification-view', { title, grid });
  } catch (err) {
    next(err);
  }
};

const buildInventoryListByType = async (req, res, next) => {
  try {
    
    const classification = req.params.classification || req.url.split("/").pop();
    const classification_name = classification.charAt(0).toUpperCase() + classification.slice(1).toLowerCase();
  
    console.log("Requested classification:", classification_name);
    const vehicles = await inventoryModel.getVehiclesByClassificationName(classification_name);
    console.log("Classification:", classification_name);

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

    return res.render("inventory/classification", {
      title: classification_name + " Vehicles",
      grid // pass the grid string, not `vehicles` or `data.rows`
    });
  } catch (error) {
    next(error);
  }
};

const getInventory = (req, res) => {
  res.render("inventory");
};

async function getVehicleDetail(req, res, next) {
  try {
    const invId = parseInt(req.params.inv_id);
    const vehicle = await inventoryModel.getVehicleById(invId);
    const nav = await utils.getNavList();
    res.render('inventory/details', {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      vehicle,
    });


  } catch (error) {
    next(error);
  }
}

exports.getVehiclesByClassification = async (req, res) => {
  try {
    const classification = req.params.classification.toLowerCase();
    const vehicles = await vehicleModel.getVehiclesByClassification(classification);

    if (!vehicles || vehicles.length === 0) {
      return res.status(404).render('no-vehicles', { classification });
    }

    res.render('inventory', {
      title: `${classification.charAt(0).toUpperCase() + classification.slice(1)} Vehicles`,
      vehicles,
      classification,
    });
  } catch (error) {
    console.error('Error fetching vehicles by classification:', error);
    res.status(500).render('error', { error });
  }
};

module.exports = {
  buildAddClassification,
  addClassification,
  buildManagement,
  buildAddInventory,
  addInventory,
  buildDetailView,
  classificationHandler,
  getInventory,
  buildInventoryListByType,
  getVehicleDetail
};
