const { body, validationResult } = require("express-validator");
const utils = require("../utilities");
const inventoryModel = require("../models/inventory-model");

const checkClassificationName = [
    body("classification_name")
        .trim()
        .isAlpha()
        .withMessage("Only letters allowed")
        .isLength({ min: 1 })
        .withMessage("Classification name is required")
];

const checkNameData = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        try {
            const nav = await utils.getNavList();
            const vehicles = await inventoryModel.getAllVehicles();
            return res.render("inventory/add-classification", {
                title: "Add Classification",
                nav,
                errors: errors.array(),
                vehicles
            });
        } catch (err) {
            return next(err);
        }
    }
    next();
};

module.exports = { checkClassificationName, checkNameData };
