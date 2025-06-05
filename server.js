const session = require("express-session");
const flash = require("connect-flash");
const express = require('express');
const app = express();
const path = require('path');
const utils = require("./utilities");
const { injectNavList } = require("./utilities/middleware");
const baseRoute = require("./routes/baseRoute");
const invRoutes = require('./routes/inventoryRoute');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const accountRoutes = require('./routes/accounts');

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/layout'); // points to views/layouts/layout.ejs

// ✅ Middleware Order: Always first
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // ✅ Enables req.body from forms
app.use(express.json());                          // ✅ Enables JSON request body

// Setup sessions
app.use(session({
  secret: "superSecret", // use a secure key in production
  resave: false,
  saveUninitialized: true,
}));

// Setup flash
app.use(flash());

// Middleware to pass flash messages to all views
app.use((req, res, next) => {
  res.locals.message = req.flash("message");
  next();
});

// JWT handling
app.use((req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.locals.account = decoded;
    } catch (err) {
      res.locals.account = null;
    }
  } else {
    res.locals.account = null;
  }
  next();
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Route declarations come AFTER middleware
app.use('/accounts', accountRoutes);
app.use('/inv', invRoutes);
app.use("/", baseRoute);
app.use(injectNavList);

// 404 Error page
app.use(async (req, res, next) => {
  let nav = await utils.getNavList();
  res.status(404).render("errors/error", {
    title: "404 - Page Not Found",
    message: "Sorry, the page you’re looking for doesn’t exist.",
    nav,
    layout: false
  });
});

// General error handler
app.use(async (err, req, res, next) => {
  console.error(err.stack);
  let nav = await utils.getNavList();
  res.status(500).render("errors/error", {
    title: "Server Error",
    message: err.message,
    nav,
  });
});

// Show registered routes in console
app._router.stack.forEach(middleware => {
  if (middleware.route) {
    console.log(middleware.route.path);
  } else if (middleware.name === 'router') {
    middleware.handle.stack.forEach(handler => {
      if (handler.route) {
        console.log(handler.route.path);
      }
    });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
