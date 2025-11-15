const utilities = require("../utilities/");
const baseController = {};

baseController.buildHome = async function (req, res) {

  const nav = await utilities.getNavList();
  console.log("Nav List:", nav);
  
  res.render("index", {
    title: "Home",
    user: req.session.user || null, // Make user available in view
    messages: {
      success: req.flash('success'),
      error: req.flash('error')
    },
    nav // include the nav if needed in layout
  });
};

module.exports = baseController;
