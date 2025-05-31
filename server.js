const session = require("express-session");
const flash = require("connect-flash");
const express = require('express');
const app = express();
const path = require('path');
const utils = require("./utilities");
const { injectNavList } = require("./utilities/middleware");
const baseRoute = require("./routes/baseRoute");

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/layout'); // points to views/layouts/layout.ejs
// Setup sessions
app.use(session({
  secret: "superSecret", // use a secure key in production
  resave: false,
  saveUninitialized: true,
}));

// Setup flash
app.use(flash());

// Pass flash messages to all views
app.use((req, res, next) => {
  res.locals.message = req.flash("message");
  next();
});

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));
app.use('/inv', require('./routes/inventoryRoute'));
app.use((req, res, next) => {
  console.log(`Request URL: ${req.url}`);
  next();
});

app.use("/", baseRoute);
app.use(injectNavList);
// After your route declarations
app.use(async (req, res, next) => {
  let nav = await utils.getNavList();
  res.status(404).render("errors/error", {
    title: "404 - Page Not Found",
    message: "Sorry, the page you’re looking for doesn’t exist.",
    nav,
    layout: false
  });
});

// Error handler
app.use(async (err, req, res, next) => {
  console.error(err.stack);
  let nav = await utils.getNavList();
  res.status(500).render("errors/error", {
    title: "Server Error",
    message: err.message,
    nav,
  });
});

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
