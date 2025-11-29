// middleware/auth.js
const jwt = require('jsonwebtoken');

// Middleware to restrict access to Employee or Admin accounts
function requireEmployeeOrAdmin(req, res, next) {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).render('account/login', {
      message: 'You must be logged in.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.account_type === 'Employee' || decoded.account_type === 'Admin') {
      req.account = decoded; // Attach decoded account to request
      res.locals.account = decoded;
      return next();
    } else {
      return res.status(403).render('account/login', {
        message: 'Access restricted to employees or admins only.',
      });
    }
  } catch (err) {
    return res.status(401).render('account/login', {
      message: 'Invalid or expired token.',
    });
  }
}

// Middleware to check if user is logged in (session-based)
function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    res.locals.account = req.session.user; // Make user available in views
    return next();
  } else {
    req.flash('error', 'Please log in to continue.');
    return res.redirect('/account/login');
  }
}

// Export both middlewares
module.exports = {
  requireEmployeeOrAdmin,
  isAuthenticated,
};
