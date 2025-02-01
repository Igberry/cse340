/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const baseController = require("./controllers/baseController");

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // not at views root

/* ***********************
 * Static File Serving
 *************************/
// Ensure static files are served from the 'public' directory or another folder
app.use(express.static("public")); // Adjust the folder path if necessary

/* ***********************
 * Routes
 *************************/
const inventoryRoutes = require("./routes/inventory");
app.use("/inv", inventoryRoutes);  // Ensure you have the correct routes defined for inventory

// Index route
app.get("/", baseController.buildHome);  // Make sure buildHome is defined in the controller

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).render('errors/500', { title: 'Server Error' });
});

// 404 Route Handling
app.use((req, res) => {
  res.status(404).render('errors/404', { title: 'Page Not Found' });
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT || 5500;  // Default to port 5500 if not specified in .env
const host = process.env.HOST || "localhost";  // Default to 'localhost' if not specified

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`App listening on http://${host}:${port}`);
});
