const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");

// Route for inventory management view
router.get("/", inventoryController.showManagementView);

module.exports = router;

router.get("/add-classification", inventoryController.showAddClassification);
router.post("/add-classification", inventoryController.addClassification);

router.get("/add-inventory", inventoryController.showAddInventory);
router.post("/add-inventory", inventoryController.addInventory);
