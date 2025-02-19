/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const cookieParser = require("cookie-parser");
const static = require("./routes/static");
const baseController = require("./controllers/baseController");

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // Not at views root

/* ***********************
 * Middleware
 *************************/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ***********************
 * Static File Serving
 *************************/
app.use(express.static("public")); // Ensure static files are served from 'public'

/* ***********************
 * Routes
 *************************/
const inventoryRoutes = require("./routes/inventory");
app.use("/inv", inventoryRoutes); // Ensure you have the correct routes defined for inventory

// Index route
app.get("/", baseController.buildHome); // Make sure buildHome is defined in the controller

// JSON object to be added to cookie
let users = { 
  name: "Ritik", 
  Age: "18"
};

// Route for adding cookie
app.get('/setuser', (req, res) => {
  res.cookie("userData", users); 
  res.send('User data added to cookie'); 
});

// Iterate users data from cookie
app.get('/getuser', (req, res) => { 
  res.send(req.cookies); // Shows all cookies 
});

/* ***********************
 * Error Handling Middleware
 *************************/
// 500 Internal Server Error
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
