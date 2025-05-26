// app.js
const express = require('express');
const app = express();
const path = require('path');
const utils = require("./utilities");
const { injectNavList } = require("./utilities/middleware");

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));
app.use('/inv', require('./routes/inventoryRoute'));
app.use((req, res, next) => {
  console.log(`Request URL: ${req.url}`);
  next();
});
app.use(injectNavList);
// After your route declarations
app.use(async (req, res, next) => {
  let nav = await utils.getNavList();
  res.status(404).render("errors/error", {
    title: "404 - Page Not Found",
    message: "Sorry, the page you’re looking for doesn’t exist.",
    nav,
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

// Route to render homepage
app.get('/', (req, res) => {
  res.render('index');
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
