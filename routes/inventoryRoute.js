const express = require('express');
const router = express.Router();
const invController = require('../controllers/invController');
const inventoryModel = require('../models/inventory-model');
const { checkClassificationName, checkNameData } = require("../utilities/classification-validation");
const { checkInventoryData, inventoryValidationRules } = require("../utilities/inventory-validation");

router.get("/inventory", invController.getInventory);
router.get("/add-inventory", invController.buildAddInventory);
router.get("/add-classification", invController.buildAddClassification);
router.get("/", invController.buildManagement);
// Detail view route for specific vehicle by ID
router.get('/detail/:inv_id', invController.buildDetailView);
// Show vehicles by classification
router.get('/type/:classification', async (req, res, next) => {
    try {
        const classification = req.params.classification;
        const vehicles = await inventoryModel.getVehiclesByClassification(classification);

        if (!vehicles || vehicles.length === 0) {
            return res.status(404).render('errors/error', { title: 'No vehicles found' });
        }

        res.render('inventory/test-list', {  // <-- make sure this template exists!
            title: `${classification.charAt(0).toUpperCase() + classification.slice(1)} Vehicles`,
            vehicles,
        });
    } catch (error) {
        next(error);
    }
});

router.get("/cause-error", (req, res, next) => {
    throw new Error("Intentional server error!");
});

router.post(
    "/add-classification",
    checkClassificationName,
    checkNameData,
    invController.addClassification
);

router.post(
    "/add-inventory",
    inventoryValidationRules,
    checkInventoryData,
    invController.addInventory
);

module.exports = router;