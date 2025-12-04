const utilities = require(".");
const baseController = require("../controllers/baseController");

const injectNavList = async (req, res, next) => {
  try {
    const navList = await utilities.getNavList();
    res.locals.navList = navList;
    next();
  } catch (error) {
    console.error("Nav injection error:", error);
    res.locals.navList = []; // Set empty array to prevent template errors
    next(); // Continue without failing the entire request
  }
};

module.exports = {
  injectNavList,
};
