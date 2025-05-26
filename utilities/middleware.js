const utilities = require(".");
const baseController = require("../controllers/baseController");

const injectNavList = async (req, res, next) => {
  try {
    const navList = await utilities.getNavList();
    res.locals.navList = navList;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  injectNavList,
};
