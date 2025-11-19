const { body, validationResult } = require("express-validator");
const utils = require("../utilities");

const inventoryValidationRules = [
    body("classification_id").notEmpty().isInt().withMessage("Classification is required"),
    body("inv_make").trim().notEmpty().withMessage("Make is required"),
    body("inv_model").trim().notEmpty().withMessage("Model is required"),
    body("inv_description").trim().notEmpty().withMessage("Description is required"),
    body("inv_price").isFloat({ gt: 0 }).withMessage("Price must be greater than 0"),
    // Year must be an integer and reasonably recent
    body("inv_year")
        .notEmpty().withMessage("Year is required")
        .isInt({ min: 1886 }).withMessage("Enter a valid year"),
    // Mileage must be an integer >= 0
    body("inv_miles").notEmpty().withMessage("Mileage is required").isInt({ min: 0 }).withMessage("Mileage must be 0 or greater"),
    body("inv_image").trim().notEmpty().withMessage("Image path is required"),
    body("inv_thumbnail").trim().notEmpty().withMessage("Thumbnail path is required"),
    body("inv_color").trim().notEmpty().withMessage("Color is required")
];

const checkInventoryData = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return utils.getNavList().then(nav => {
            return utils.buildClassificationList(req.body.classification_id).then(classificationList => {
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
