const { body, validationResult } = require("express-validator");

const inventoryValidationRules = [
    body("classification_id").notEmpty().isInt(),
    body("inv_make").trim().notEmpty(),
    body("inv_model").trim().notEmpty(),
    body("inv_description").trim().notEmpty(),
    body("inv_price").isFloat({ gt: 0 }),
    body("inv_year").isLength({ min: 4 }),
    body("inv_miles").optional().isInt(),
    body("inv_color").trim().notEmpty()
];

const checkInventoryData = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return utilities.getNav().then(nav => {
            return utilities.buildClassificationList(req.body.classification_id).then(classificationList => {
                res.render("inventory/add-inventory", {
                    title: "Add Vehicle",
                    nav,
                    classificationList,
                    errors: errors.array(),
                    ...req.body
                });
            });
        });
    }
    next();
};

module.exports = { inventoryValidationRules, checkInventoryData };
