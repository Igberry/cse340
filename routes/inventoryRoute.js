const express = require('express');
const router = express.Router();
const invController = require('../controllers/invController');
const inventoryModel = require('../models/inventory-model');
const { checkClassificationName, checkNameData } = require("../utilities/classification-validation");
const { checkInventoryData, inventoryValidationRules } = require("../utilities/inventory-validation");
const { classificationHandler } = require('../controllers/invController');


router.get("/inventory", invController.getInventory);
router.get("/add-inventory", invController.buildAddInventory);
router.get("/add-classification", invController.buildAddClassification);
router.get("/", invController.buildManagement);
router.get('/detail/:inv_id', invController.buildDetailView);
router.get('/type/:classification_name', invController.buildInventoryListByType);
router.get('/type/custom', invController.buildInventoryListByType);
router.get('/type/sedan', invController.buildInventoryListByType);
router.get('/type/suv', invController.buildInventoryListByType);
router.get('/type/truck', invController.buildInventoryListByType);



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