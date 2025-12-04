require('dotenv').config();
const express = require('express');
const session = require("express-session");
const flash = require("connect-flash");
const path = require('path');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { checkLogin } = require("./utilities/handle-session");

const app = express();

// Utilities and middleware
const utils = require("./utilities");
const { injectNavList } = require("./utilities/middleware");

// Routes
const baseRoute = require("./routes/baseRoute");
const invRoutes = require('./routes/inventoryRoute');
const accountRoutes = require('./routes/accounts');

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Session & Flash
app.use(session({
  secret: process.env.SESSION_SECRET || "supersecret",
  resave: false,
  saveUninitialized: true,
}));

// ✅ Make logged-in user available in all views
app.use((req, res, next) => {
  res.locals.account = req.session.user || null;
  next();
});

app.use(checkLogin);
app.use(flash());

// Custom utility middleware (e.g. navbar builder, JWT checks)
app.use(injectNavList);

// Flash message locals
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.errors = req.flash('errors');
  next();
});

// Use routes
app.use("/", baseRoute);         // Home and general pages
app.use("/inv", invRoutes);  
app.use("/account", accountRoutes); // Account-related routes

// 404 error handling
app.use((req, res) => {
  res.status(404).render("errors/error", {
    message: "Sorry, the page you are looking for was not found."
  });
});

// Global error handling
app.use((err, req, res, next) => {
  console.error("Global Error:", err);
  res.status(500).render("errors/error", {
    message: err.message || "Something went wrong on the server."
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
