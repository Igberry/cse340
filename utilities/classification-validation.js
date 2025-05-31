const { body, validationResult } = require("express-validator");

const checkClassificationName = [
    body("classification_name")
        .trim()
        .isAlpha()
        .withMessage("Only letters allowed")
        .isLength({ min: 1 })
        .withMessage("Classification name is required")
];

const checkNameData = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const nav = require("../utilities/index").getNavList();
        return res.render("inventory/add-classification", {
            title: "Add Classification",
            nav,
            errors: errors.array(),
        });
    }
    next();
};

module.exports = { checkClassificationName, checkNameData };
